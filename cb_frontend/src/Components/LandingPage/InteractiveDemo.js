import { useEffect, useRef, React } from 'react'

export default function InteractiveDemo() {
    return (
        <div className="relative w-full h-[80vh] max-w-5xl mx-auto">
            <iframe
                src="https://demo.arcade.software/hx7qTx8JOu2PMVOoaHc8?embed&embed_mobile=inline&embed_desktop=inline&show_copy_link=true"
                title="Crayons.me"
                frameBorder="0"
                loading="lazy"
                allowFullScreen
                allow="clipboard-write"
                className="absolute top-0 left-0 w-full h-full"
            />
        </div>
    )
}
      