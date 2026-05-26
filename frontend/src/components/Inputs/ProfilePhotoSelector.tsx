import React from 'react'
import { LuUser, LuUpload, LuTrash } from 'react-icons/lu'

const ProfilePhotoSelector = ({ image, setImage }: { image: File | null, setImage: (image: File | null) => void }) => {
    const inputRef = React.useRef<HTMLInputElement>(null)
    const [previewUrl, setPreviewUrl] = React.useState<string | null>(null)

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file: File | null = e.target.files?.[0] ?? null

        if (file) {
            setImage(file)
            if (previewUrl) URL.revokeObjectURL(previewUrl)
            setPreviewUrl(URL.createObjectURL(file))
        }

    }

    const handleImageRemove = () => {
        setImage(null)
        if (previewUrl) URL.revokeObjectURL(previewUrl)
        setPreviewUrl(null)
    }

    const onChooseFile = () => {
        inputRef.current?.click()
    }

    return (
        <div className="flex justify-center mb-6">
            <input
                type="file"
                accept="image/*"
                ref={inputRef}
                onChange={handleImageChange}
                className="hidden"
            />

            {!image ? (
                <div className="w-20 h-20 flex items-center justify-center bg-blue-100/50 rounded-full relative cursor-pointer">
                    <LuUser className="text-4xl text-primary" />

                    <button
                        type="button"
                        className="w-8 h-8 flex items-center justify-center bg-primary text-white rounded-full"
                        onClick={onChooseFile}
                    >
                        <LuUpload />
                    </button>

                </div>
            ) : (
                <div className="relative  cursor-pointer" >
                    <img src={previewUrl ?? undefined}
                        alt="profile photo"
                        className="w-20 h-20 rounded-full object-cover"
                    />
                    <button
                        type="button"
                        className="w-8 h-8 flex items-center justify-center bg-red-500 text-white rounded-full absolute -bottom-1 -right-1"
                        onClick={handleImageRemove}
                    >
                        <LuTrash />
                    </button>

                </div>

            )}

        </div>
    )
}

export default ProfilePhotoSelector
