const Replicate = require("replicate")
const replicate = new Replicate()

const DEFAULT_SCHNELL_SEEDS = [19129, 34895, 34135] //19129 good
const DEFAULT_DEV_SEEDS = [19129, 34895, 34135, 23006, 98663, 42145] //19129 good, 98663-very good result, 42145 very nice
//34135(a bit too much shading), 23006 -good
//19129 more cartoonish

const PRO_SEEDS = [38681, 79698, 21705]

const LORA_SEEDS = [9890, 17362/*really nice*/, 51337, 26610, 27398]

const SAFETY_CHECKER = false

const randomSavedSeed = (seed_list= DEFAULT_DEV_SEEDS) => {
    return seed_list[Math.floor(Math.random()*seed_list.length)]
}

const MODELS = {
    SCHNELL: "black-forest-labs/flux-schnell",
    PRO: "black-forest-labs/flux-1.1-pro",
    BETTER: "black-forest-labs/flux-better"
};

const randomSeed = () => {
    return Math.floor(Math.random() * 99999)
}

const _runModel = async (input, model) => {
    const output = await replicate.run(model, {input: input});
    console.log('output', output);
    // Get the stream    
    const stream = model.includes("flux-1.1-pro") ? output : output[0];
    
    return stream      
}

const queryFluxSchnell = (prompt, seed = randomSavedSeed(DEFAULT_SCHNELL_SEEDS)) => {
    const input = {
        prompt: prompt,
        disable_safety_checker: !SAFETY_CHECKER,
        seed: seed,
        output_quality: 100,
        output_format: "png",
        aspect_ratio: "2:3"
    };
    return _runModel(input, "black-forest-labs/flux-schnell")
}

const queryFluxPro = (prompt, seed=randomSeed(), safety_tolerance=3) => {
    const input = {
        prompt: prompt,
        aspect_ratio: "2:3",
        seed: seed,
        output_format: "png",
        safety_tolerance: safety_tolerance,
        prompt_upsampling: true,
        disable_safety_checker: true
      };
    return _runModel(input, "black-forest-labs/flux-1.1-pro")
}

const queryFluxBetter = (prompt, seed = randomSavedSeed(DEFAULT_DEV_SEEDS)) => {
    const input = {
        go_fast: false,
        prompt: prompt,
        seed: seed,
        guidance: 3.2,//2.8, //2.5-sketchy/more mistakes fingers, 5-5 very cartoon smooth coloring book outlines
        num_outputs: 1,
        disable_safety_checker: !SAFETY_CHECKER,
        aspect_ratio: "2:3",
        output_format: "png",
        output_quality: 80,
        prompt_strength: 0.8,
        num_inference_steps: 50
    };

    return _runModel(input, "black-forest-labs/flux-dev")
}

//70878
const queryFineTuned = (prompt, {simple=false, seed=randomSeed(), num_outputs=1} = {}) => {
    const weights_url = simple ? 
        `https://civitai.com/api/download/models/888917?type=Model&format=SafeTensor&token=${process.env.CIVITAI_API_TOKEN}`
    :
        `https://civitai.com/api/download/models/977806?type=Model&format=SafeTensor`;

    const prompt_key_words = simple ? "coloring book page, of" : "coloring page, of"

    const model = "lucataco/flux-dev-lora:091495765fa5ef2725a175a57b276ec30dc9d39c22d30410f2ede68a3eab66b3"

    //TODO: input params are tuned for non simple model
    const input = {
        prompt: `${prompt_key_words} ${prompt}. Bold and clear lines.`,
        hf_lora: weights_url,
        seed: seed,
        num_outputs: num_outputs,
        disable_safety_checker: !SAFETY_CHECKER,
        output_format: "png",
        aspect_ratio: "2:3",        
        num_inference_steps: 36,
        prompt_strength: 1,
        guidance_scale: 3.5,
        lora_scale: 0.6,
    };
    return _runModel(input, model)
}  


module.exports = {
    queryFluxSchnell,
    queryFluxBetter,
    randomSavedSeed,
    randomSeed,
    queryFineTuned,
    queryFluxPro
}

/**
 * NSFW ERORR: 
 * {
  "completed_at": "2024-11-11T11:15:07.084190Z",
  "created_at": "2024-11-11T11:15:01.091000Z",
  "data_removed": false,
  "error": "Error generating image: NSFW content detected.",
  "id": "skbj0q97cdrga0ck3bqtxjkbz4",
  "input": {
    "prompt": "Children's detailed black and white coloring page. In the center of the page, a slice of pizza stands vertically, portrayed as a detective. Atop the pizza slice, a wide-brimmed detective hat is positioned with a slight forward tilt, adding a sense of intrigue. Near the top right of the pizza's surface, an olive serves as a makeshift 'eye', over which a small monocle is carefully placed. Below, protruding from the pizza's imaginary 'mouth' area, a cigar is depicted, with a thin curl of smoke rising gently upwards.\n\nThe edge of the pizza, representing the crust, suggests the outline of 'shoulders' for the detective character. Within the cheese and toppings area of the pizza slice, a distinct checkered pattern is intertwined, reminiscent of a classic detective's tweed coat. Scattered across the pizza's surface are clearly defined pepperonis and mushrooms, providing additional detail and imaginative opportunities for filling in.\n\nLeaned casually against one side of the pizza slice rests a lightly outlined magnifying glass, serving as the only background element. This minimal design keeps the focal point on the detective pizza, allowing it to stand out prominently on the page. Only black outlines, colorless, no shadows, no shading, black and white, coloring page.",
    "aspect_ratio": "2:3",
    "output_format": "webp",
    "output_quality": 80,
    "safety_tolerance": 5,
    "prompt_upsampling": true
  },
  "logs": "Using seed: 51913\nRunning prediction... \nGenerating image...\nNSFW content detected\nTraceback (most recent call last):\n  File \"/src/predict.py\", line 159, in predict\n    image_url = await self.client.predict(\n                ^^^^^^^^^^^^^^^^^^^^^^^^^^\n  File \"/src/bfl.py\", line 61, in predict\n    raise Exception(\"NSFW content detected.\")\nException: NSFW content detected.\n\nThe above exception was the direct cause of the following exception:\n\nTraceback (most recent call last):\n  File \"/usr/local/lib/python3.12/site-packages/cog/server/worker.py\", line 243, in _handle_predict_error\n    yield\n  File \"/usr/local/lib/python3.12/site-packages/cog/server/worker.py\", line 282, in _predict_async\n    output = await result\n             ^^^^^^^^^^^^\n  File \"/src/predict.py\", line 178, in predict\n    raise ValueError(f\"Error generating image: {str(e)}\") from e\nValueError: Error generating image: NSFW content detected.",
  "metrics": {
    "image_count": 0,
    "predict_time": 5.984336918,
    "total_time": 5.99319
  },
  "output": null,
  "started_at": "2024-11-11T11:15:01.099853Z",
  "status": "failed",
  "urls": {
    "stream": "https://stream.replicate.com/v1/files/fddq-jwi7ohhikpojyo3vk6cgk4wwxeh5b7radbqesriopxhjhpp654aq",
    "get": "https://api.replicate.com/v1/predictions/skbj0q97cdrga0ck3bqtxjkbz4",
    "cancel": "https://api.replicate.com/v1/predictions/skbj0q97cdrga0ck3bqtxjkbz4/cancel"
  },
  "version": "4f7f6b19f702914394c150efb78c9839966207238bce54023709382495e1b190"
}
 */