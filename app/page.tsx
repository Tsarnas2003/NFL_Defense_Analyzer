"use client"


import{useState} from "react";


export default function Home() {
  const [image, setImage] = useState<string | null>(null);
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if(!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };  

  return (
    <main className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-bold mb-4">NFL Defense Analyzer</h1>
      <p className="text-gray-400 text-lg mb-8">Upload a pre-snap image to identify the defensive coverage</p>

      <label className="border-2 border-dashed border-gray-600 rounded-xl p-12 text-center cursor-pointer hover:border-gray-400 transition-colors">
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageUpload}
        />
        {image ? (
          <img src={image} alt="Uploaded play" className="max-w-lg rounded-lg" />
        ) : (
          <p className="text-gray-400">Drop an image here or click to upload</p>
        )}
      </label>
    </main>
  )
}