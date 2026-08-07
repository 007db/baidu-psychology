// =====================================================
// 摆渡心理 V9.0
// functions/api/save-record.js
//
// 保存咨询记录
// Cloudflare Pages Functions + D1
// =====================================================


export async function onRequestPost({ request, env }) {


    try {


        const body = await request.json();



        const {


            appointment_id,

            consultant,

            title,

            content,

            mood,

            risk_level,

            next_plan


        } = body;



        // 参数检查

        if (!appointment_id || !consultant || !content) {


            return Response.json({

                success:false,

                message:"参数不完整"

            });


        }




        const result = await env.DB.prepare(

        `

        INSERT INTO consultation_records

        (

            appointment_id,

            consultant,

            title,

            content,

            mood,

            risk_level,

            next_plan

        )


        VALUES

        (?,?,?,?,?,?,?)

        `


        )

        .bind(

            appointment_id,

            consultant,

            title || "",

            content,

            mood || "",

            risk_level || "低",

            next_plan || ""

        )

        .run();






        return Response.json({


            success:true,


            message:"咨询记录保存成功",


            id:result.meta.last_row_id


        });





    } catch(error) {


        return Response.json({


            success:false,


            message:"服务器错误",


            error:error.message


        },500);


    }


}
