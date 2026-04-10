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
        temperature: 0.0,
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
                text: `You are an expert NFL defensive coordiator analyzing pre-snap defensive  shell formations.
                
IMPORTANT: This is a diagonal sideline view. Depth is compressed. Do not anchor to the first indicator you see. You must consider ALL evidence before making a call.



PRE-ANALYSIS - Before anything else, describe exactly what you see:
List every visible defender from deep to shallow:
- Player 1: [position on field, depth, body position]
- Player 2: [position on field, depth, body position]   
Do this for all players you can see, even if you are not sure of their position. This is just a description of what you see, not an analysis yet.
Include these lists in your final reasoning. Do not skip this step. It is critical to the analysis.
Continue for every visible defender.
- IMPORTANT: The hashmarks are the 5 yard marks in the middle of the field. Do not group players inside the hashmarks unless they are clealry between or near the hashmarks. 

PATTERN RECOGNITION (DO THIS FIRST):

Identify which of these patterns best matches the defense:

- Cover 2 Pattern:
  • Two deep defenders split left/right(2-high)
  • Corners shallow (0–5 yards), outside leverage, eyes inside
  • Both Corners aligend up at the same depth

- Cover 3 Pattern:
  • One deep middle defender (single high)
  • Two outside defenders deeper (8–12 yards) aligned over WRs
  • Corners aligned at different depths
  
  
- Cover 4 Pattern:
  • Four defenders deep (corners + safeties all deep)
  • Corners aligned 7–10 yards off

- Cover 1 Pattern:
  • One deep safety (single high)
  • Corners tight to receivers (man alignment)
  • Linevackers closer to line of scrimmage, often overtop runningbacks and tieght ends
  • Man Coverage responsibilties across all eligible receivers

- Cover 0 Pattern:
 • No deep defenders 
 • Corners tight to receivers

 - Cover 2 Man Pattern:
 • 2 Deep defenders split left/right (2-high) 
 • Corners tight to receivers forcing inside leverage and eyes on the receiver 


STEP 1 - COUNT SAFETIES:
From your pre-analysis list, identify players clearly between the number marks and 10+ yards deep.
- Remember this is a compressed diagonal view.
- A player outside the number marks is a corner not a safety regardless of depth.
- Safeties are the deepest defenders, typically aligned between the numbers, not strictly between the hashes.
- If you see one safety do not autmatically assume a 1 high look. You need to analzye the entire field and all players before making that call.
- Go back to your descriptions of the players who have similar postions, if the depths for each player who is a safety are not witin 0-5 yards understand that the defense
    could be in 1 high look. If the players depths are within 0-5 yards understand the defense could be in a 2 high look.
 - What is the most likely safety shell (1-high or 2-high), based on deepest defenders and their spacing



STEP 2 - ANALYZE EACH CORNER INDIVIDUALLY:
For each visible cornerback state separately:
Top corner (horizontal image use top and bottom instead of left and right:
- Depth from line of scrimmage are they shallow (0-5 yeards), mid (5-10 yards), or deep (10+ yards)
- Use the hashes on the field as a reference point for depth, each has is one yard.
- Which direction is their helmet facing
- Distance from nearest receiver
- Zone or man indicator and why
- Inside or outside leverage and why compared to the nearest receiver and compared to the safeties


Bottom corner (horizontal image use top and bottom instead of left and right):
- Depth from line of scrimmage are they shallow (0-5 yeards), mid (5-10 yards), or deep (10+ yards)
- Use the hashes on the field as a reference point for depth, each has is one yard.
- Which direction is their helmet facing
- Distance from nearest receiver
- Zone or man indicator and why
- Inside or outside leverage and why compared to the nearest receiver and compared to the safeties


Linebackers:
- Depthon from line of scrimmage
- Which direction is their helmet facing
- Are they aligned in a line across the formation not involved with oposing tight ends, running backs, or slot receivers (zone indicator) or are they aligned overtop or close to tight ends, running backs, or slot receivers
- Are they aligned overtop or close to any eligible receivers(man indicator)
- What is the most likely coverage for this linebacker based on these indicators  ?           

STEP 3 - BUILD THE CASE FOR AND AGAINST EACH COVERAGE:
Based on your pre-analysis, list evidence FOR and AGAINST the two most likely coverages.
If corners are clearly:
-Shallow + outside leverage + eyes inside → strongly favor Cover 2
-EVEN IF safety count appears ambiguous use corner leverage and linebacker positioning to determine defense



Most likely coverage A: [name]
Evidence FOR: [list specific things you see]
Evidence AGAINST: [list specific things that contradict this]

Most likely coverage B: [name]
Evidence FOR: [list specific things you see]
Evidence AGAINST: [list specific things that contradict this]

STEP 4 - WEIGH THE EVIDENCE:
Which coverage has stronger evidence? 
Are there any indicators strong enough to override the others?
One pressed corner facing a receiver does NOT automatically mean man coverage.
One deep player does NOT automatically mean two safeties.
Weigh ALL indicators together not individually.
Does the defensive alignment as whole make sense for how the offense is lined up?

STEP 5 - MAKE YOUR CALL:
Only after completing Steps 1-4 make your final coverage call.

Assign confidence based on how decisive the evidence was:
- 90-97%: Evidence strongly favored one coverage with almost no conflicting indicators
- 75-89%: Evidence favored one coverage but some conflicting indicators exist
- 60-74%: Evidence was mixed, going with most likely but not confident
- 45-59%: Evidence was genuinely ambiguous, could be multiple coverages
- If you cannot see corner body position clearly → maximum 60% confidence


Return ONLY this format:
COVERAGE: [specific coverage type man or zone. If man specify which type. If zone specify which type]
CONFIDENCE: [percentage]
REASONING Cornerbacks: [what you saw for each corner individually and how it influenced your call( Include your pre-analysis for each corner in this section as well)]
REASONING Safeties: [what you saw and how it influenced your call (Inlcyude your pre-analysis for each safety in this section as well)]
REASONING Linebackers: [what you saw and how it influenced your call (Include your pre-analysis for each linebacker in this section as well)]`,
        

            
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



