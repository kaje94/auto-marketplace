"use client";

import { useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import { CheckIcon, PlusIcon, TrashIcon } from "@/icons";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import clsx from "clsx";

export const ImageUpload = () => {
    const [rootParent] = useAutoAnimate<HTMLDivElement>();
    const [files, setFiles] = useState<(File & { preview: string })[]>([]);
    const [thumbnailIndex, setThumbnailIndex] = useState(0);
    const { getRootProps, getInputProps, open } = useDropzone({
        accept: { "image/*": [] },
        multiple: true,
        noClick: true,
        noKeyboard: true,
        onDrop: (acceptedFiles) => {
            setFiles((files) => [...files, ...acceptedFiles.map((file) => Object.assign(file, { preview: URL.createObjectURL(file) }))]);
        },
    });

    const removeImage = (indexToRemove: number) => {
        if (indexToRemove >= 0 && indexToRemove < files.length) {
            setFiles([...files.slice(0, indexToRemove), ...files.slice(indexToRemove + 1)]);
        }
    };

    useEffect(() => {
        // Make sure to revoke the data uris to avoid memory leaks, will run on unmount
        return () => files.forEach((file) => URL.revokeObjectURL(file.preview));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="mt-2 flex flex-wrap gap-2" ref={rootParent} {...getRootProps({})}>
            {files.map((file, index) => {
                const isThumbnail = thumbnailIndex === index;
                return (
                    <div className="rounded-box relative box-border inline-flex h-24 w-24 border-2" key={file.name}>
                        <div className="rounded-box h-full w-full overflow-hidden">
                            <Image
                                src={file.preview}
                                height={50}
                                width={50}
                                alt="Image-preview"
                                className="box-border block h-full w-full overflow-hidden object-cover"
                                // Revoke data uri after image is loaded
                                onLoad={() => {
                                    URL.revokeObjectURL(file.preview);
                                }}
                            />
                        </div>
                        <div className="absolute right-0 top-0 z-10 flex h-full w-full flex-row items-center justify-center bg-base-300 opacity-0 duration-200 hover:bg-opacity-20 hover:opacity-100">
                            <div className="flex items-center justify-center gap-2">
                                <button className="btn-error btn-square btn-sm btn" onClick={() => removeImage(index)}>
                                    <TrashIcon />
                                </button>

                                <div
                                    className="tooltip tooltip-bottom"
                                    data-tip={
                                        isThumbnail ? "This image will be the thumbnail for the advert" : "Use this as the thumbnail for the advert"
                                    }
                                >
                                    <button
                                        onClick={() => setThumbnailIndex(index)}
                                        className={clsx({
                                            "btn-info btn-sm btn btn-square": true,
                                            "btn-outline": !isThumbnail,
                                            "opacity-20": isThumbnail,
                                        })}
                                    >
                                        <CheckIcon />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}

            <input {...getInputProps()} />
            <div
                onClick={open}
                className="rounded-box flex h-24 w-24 cursor-pointer flex-col items-center justify-center border border-dashed border-gray-300 bg-gray-100 p-2 text-gray-400 duration-150 hover:bg-gray-200"
            >
                <PlusIcon className="h-10 w-10" />
                <div className="text-center text-xs">Add Images</div>
            </div>
        </div>
    );
};
