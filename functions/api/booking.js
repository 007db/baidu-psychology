export async function onRequestPost({ request, env }) {
    try {
        const data = await request.json();

        const appointmentTime =
            `${data.date || ""} ${data.time || ""}`.trim();

        // 1. 先保存预约到 D1
        await env.DB.prepare(
            `
            INSERT INTO appointments
            (
                name,
                phone,
                wechat,
                type,
                appointment_time,
                message,
                status
            )
            VALUES
            (?,?,?,?,?,?,?)
            `
        )
        .bind(
            data.name || "",
            data.phone || "",
            data.wechat || "",
            data.type || "",
            appointmentTime,
            data.message || "",
            "待处理"
        )
        .run();

        // 2. 组织邮件内容
        const emailText = `
【摆渡心理】新预约通知

姓名：${data.name || "未填写"}

联系电话：${data.phone || "未填写"}

微信号：${data.wechat || "未填写"}

咨询类型：${data.type || "未填写"}

预约日期：${data.date || "未填写"}

预约时间：${data.time || "未填写"}

留言：
${data.message || "无"}

预约状态：待处理

提交时间：
${new Date().toLocaleString("zh-CN", {
    timeZone: "Asia/Shanghai"
})}
        `.trim();

        // 3. 发送邮件
        let emailSent = false;

        if (env.RESEND_API_KEY) {

            const emailResponse = await fetch(
                "https://api.resend.com/emails",
                {
                    method: "POST",

                    headers: {
                        "Authorization":
                            `Bearer ${env.RESEND_API_KEY}`,
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        from: "摆渡心理预约 <onboarding@resend.dev>",
                        to: ["1907132646@qq.com"],
                        subject:
                            `【摆渡心理】新预约 - ${data.name || "客户"}`,
                        text: emailText
                    })
                }
            );

            if (emailResponse.ok) {
                emailSent = true;
            } else {
                const emailError =
                    await emailResponse.text();

                console.error(
                    "邮件发送失败：",
                    emailError
                );
            }
        } else {
            console.error(
                "未配置 RESEND_API_KEY"
            );
        }

        // 4. D1 已经保存成功，即使邮件失败也不要让预约失败
        return Response.json({
            success: true,
            message: emailSent
                ? "预约提交成功，我们会尽快联系您"
                : "预约提交成功，我们会尽快联系您"
        });

    } catch (error) {

        console.error(error);

        return Response.json(
            {
                success: false,
                error: error.message || "预约提交失败"
            },
            {
                status: 500
            }
        );
    }
}
