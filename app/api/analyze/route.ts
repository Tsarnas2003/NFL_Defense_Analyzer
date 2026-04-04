import Anthropic from "@anthropic-ai/sdk"
import {NextResponse} from "next/server"

const client = new Anthropic()

export async function POST(request: Request){
    console.log("KEY EXISTS:", !!process.env.ANTHROPIC_API_KEY)
    console.log("KEY START:", process.env.ANTHROPIC_API_KEY?.slice(0, 15))
    const {image} = await request.json()


    const response = await client.messages.create({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1024,
        messages: [
            {
            role: "user",
            content:[
                {
                type: "image",
                source:{
                    type: "base64",
                    media_type: "image/jpeg",
                    data: image.split(",")[1],

                },
            },
            {
                type: "text",
                text: `You are an expert NFL defensive coordiator analyzing pre-snap defensive formations.
                
                Analyze this pre-snap image and identify the defensive coveraege.
                
                Focuse On:
                - Saftety depth and the alignment( 1 or 2 deep safeties?)
                -cornerback alignment( are they pressed or giving cushion and are they facing the opposing wide receiver or the quarterback?)
                - Linebacker depth( at the line or dropped back?)
                - Overall defensive spacing and personel on the fielf
                
                Return your response in this exact format:
                COVERAGE: [coverage type (man coverage or zone)]
                CONFIDENCE: [percentage confidence in your analysis]
                REASONING: [2-3 sentences explaining what you see and what your analysis is]`,
        

            
            },

            ],
        },

        ],
    })
    
    const result = response.content[0]
    if(result.type !== "text"){

    return NextResponse.json({error: "Unexpected response "}, {status: 500})
    }
    return NextResponse.json({analysis: result.text})
}



