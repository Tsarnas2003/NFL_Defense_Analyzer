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
        temperature: 0,
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
                DO NOT default to zone coverage defenses in the NFL play man coverage a good amount.
                Analyze the field in levels using the yardlines as a reference for positon on the field as well as the line of scrimmage. 
                Analyze the fied using sidelines and where the ball is placed as a reference for the middle of the field.
                Analyze where the short side of the field is as which side is the wide side of the field and where the defense uses position for the each side.
                If defense on the right side of image start reading from right side of image(deep coverage) to the left side(line of scrimmage) and then anaylze the left side of the image starting from the left side of the image (deep coverage) to the line of scrimmage.
                If defense on the left side of image start reading from left side of image(deep coverage) to right side of image (line of scrimmage) and then analyze the right side of the image starting from the right side of the image (deep coverage) to the line of scrimmage.

                IMPORTANT: DO NOT GROUP CORNERBACKS TOGETHER AS A UNIT. ANALYZE EACH CORNERBACK INDIVIDUALLY AND MAKE IT KNOWN IN YOUR REASONING.
                
                Step 1 - Count safeties and determine base coverage:
                If a defensive player is lineed up outside of the wide receivers and is deeper than linebacks do not always count as safety.
                - 0 safeties deep = COVER 0 (man, no help)
                - 1 safety deep centered = Cover 1 or Cover 3
                - 1 safety deep offset = could be Cover 3 or Cover 1 depending on corners
                - 2 Safties 1 deeper than the other = look at the aligment compared to the dashed lines. 
                    If one safety is deeper and lined up inside the dashed lines while the other safety is lower and not in the dashed lines then likely cover 3. 
                - 2 safeties split evenly deep = COVER 2 (zone) or 2 MAN (man)
                - 2 safeties deep + corners bailing = COVER 2 zone
                - 2 safeties deep + corners pressed on receivers = 2 MAN
                - 4 defenders deep = COVER 4
                -
                
                Step 2 - Carefully observe every visible defender's body language:
                - Do not group cornerbacks together as a unit. Analyze each cornerback individually and look for specific indicators of zone or man
                - Which direction are cornerbacks FACING? Facing the receiver = man. Facing the QB = zone.
                - Are corners within 1-2 yards of receivers (pressed)? = strong man indicator
                - Are corners giving 3-5 yards of cushion and turned toward the QB = strong zone indicator
                - Are corners giving 5+ yards of cushion AND facing QB? = zone indicator
                - Are safeties rotated to one side or walked down near line? = man indicator
                - Are defenders mirroring receiver splits? = man indicator

                 

                Step 3 - Distinguish man from zone using corner body position:
                ZONE indicators: (Always move top down starting at safeties, then move to corners, laslty linebackers)
                - Corners face the quarterback
                - Corners give cushion (5+ yards)
                - One safety deeper than the other safety and is lined up inside the dashed lines while the other safety is lower and not in the dashed lines.
                - Corners backpedal on snap
                - Defenders in generic spacing not tied to specific receivers
                - If not receiever line up in front of corner then likely more to turn their body towards the quarterback
                - Safteies facing the QB not Widerecievers or tight ends = zone indicator

                MAN indicators:
                - Corners face their assigned receiver
                - linebackers or safeties lined up over tight ends and running backs
                - Corners pressed (1-3 yards) OR off but turned toward receiver
                - Safety rotated or walked down
                - Each defender clearly attached to a specific offensive player

                Indicators of Both:
                - Two corners pressed on receivers facing wide recivers = Look at saftey depths and linebacker positions to determine if man or zone(cover 2 or 2 man)



                Step 4 - Assign confidence honestly:
                - 90-97%: Textbook formation, no ambiguity whatsoever
                - 75-89%: Strong indicators but one element is unclear
                - 60-74%: Could be two coverages, going with most likely
                - 45-59%: Genuinely ambiguous, disguised or hard to read
                - NEVER default to 82% or 85% — pick a number that reflects real certainty

                Step 5 - Before finalizing your answer ask yourself:
                - Have I considered man coverage seriously?
                - Is my confidence number genuinely specific to this image?
                - Would a different coverage fit the indicators equally well?
                
                Important: Do NOT default to 85% or 78% Have a specific confidence level for each analysis. Most coverages will fall between 60-95% confidence. 
                Important: DO NOT default to cover 2. Fully understand and see the indicators for all the players on the field.
        
                
                Return your response in this exact format:
                COVERAGE: [coverage type (man coverage or zone if zone specify type of zone coverage like cover 2, cover 3, cover 4, etc)]
                CONFIDENCE: [percentage confidence in your analysis based on the clarity of the image and the distinctiveness of the defensive alignment]
                REASONING Cornerbacks: [1-2 sentences explaining what you see and what your analysis is for the cornerbacks],
                REASONING Safeties: [1-2 sentences explaining what you see and what your analysis is for the safeties],
                REASONING Linebackers: [1-2 sentencs explaining what you see and what your analysis is for the linebackers ]`,
        

            
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



