"use client";

import { useEffect, forwardRef } from "react";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import { CheckIcon, PlusIcon, TrashIcon } from "@/icons";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import clsx from "clsx";
import { ImageFile } from "@/utils/types";

interface Props {
    files?: ImageFile[];
    setFiles?: (images: ImageFile[]) => void;
    loading?: boolean;
    loadingPlaceholderCount?: number;
    error?: string;
}

export const ImageUpload = forwardRef<HTMLInputElement, Props>((props, _formRef) => {
    const { files = [], setFiles = () => {}, loading, error, loadingPlaceholderCount = 1 } = props;
    const [rootParent] = useAutoAnimate<HTMLDivElement>();
    const { getRootProps, getInputProps, open } = useDropzone({
        accept: { "image/*": [] },
        disabled: loading,
        multiple: true,
        noClick: true,
        noKeyboard: true,
        onDrop: (acceptedFiles) => {
            const newFileList: ImageFile[] = [...files, ...acceptedFiles.map((file) => ({ file, preview: URL.createObjectURL(file) }))];
            if (newFileList[0] && !newFileList.some((item) => item.isThumbnail)) {
                newFileList[0].isThumbnail = true;
            }
            setFiles(newFileList);
        },
    });

    const removeImage = (indexToRemove: number) => {
        if (indexToRemove >= 0 && indexToRemove < files.length) {
            const newFileList = [...files.slice(0, indexToRemove), ...files.slice(indexToRemove + 1)];
            if (newFileList[0] && !newFileList.some((item) => item.isThumbnail)) {
                newFileList[0].isThumbnail = true;
            }
            setFiles(newFileList);
        }
    };

    useEffect(() => {
        // Make sure to revoke the data uris to avoid memory leaks, will run on unmount
        return () =>
            files?.forEach((item) => {
                if (item.preview) {
                    URL.revokeObjectURL(item.preview);
                }
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            <div className="mt-2 flex flex-wrap gap-2" ref={rootParent} {...getRootProps({})}>
                {files?.map((file, index) => {
                    return (
                        <div className="rounded-box relative box-border inline-flex h-24 w-24 border-2" key={`${index}-${file.name}`}>
                            <div className="rounded-box h-full w-full overflow-hidden">
                                <Image
                                    src={file.preview ?? ""}
                                    height={50}
                                    width={50}
                                    alt="Image-preview"
                                    className="box-border block h-full w-full overflow-hidden object-cover"
                                    // Revoke data uri after image is loaded
                                    // onLoad={() => {
                                    //     URL.revokeObjectURL(file.preview!);
                                    // }}
                                />
                            </div>
                            <div className="absolute right-0 top-0 z-10 flex h-full w-full flex-row items-center justify-center bg-base-300 opacity-0 duration-200 hover:bg-opacity-20 hover:opacity-100">
                                <div className="flex items-center justify-center gap-2">
                                    <button
                                        className="btn-error btn-square btn-sm btn"
                                        onClick={(event) => {
                                            removeImage(index);
                                            event.preventDefault();
                                        }}
                                    >
                                        <TrashIcon />
                                    </button>

                                    <div className="tooltip tooltip-bottom" data-tip={file.isThumbnail ? "Is Thumbnail" : "Set as Thumbnail"}>
                                        <button
                                            onClick={(event) => {
                                                if (!file.isThumbnail) {
                                                    setFiles(files.map((item, i) => ({ ...item, isThumbnail: index === i })));
                                                }
                                                event.preventDefault();
                                            }}
                                            className={clsx({
                                                "btn-info btn-sm btn btn-square": true,
                                                "btn-outline": !file.isThumbnail,
                                                "opacity-20 cursor-default": file.isThumbnail,
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
                {loading ? (
                    <>
                        {new Array(loadingPlaceholderCount).fill("").map((_, i) => (
                            <div
                                key={`${i}`}
                                className="rounded-box flex h-24 w-24 animate-pulse cursor-progress flex-col items-center justify-center border border-dashed bg-base-200"
                            />
                        ))}
                    </>
                ) : (
                    <div
                        onClick={open}
                        className={clsx({
                            "rounded-box flex h-24 w-24 cursor-pointer flex-col items-center justify-center border border-dashed  bg-base-200 p-2 duration-150 hover:bg-base-300":
                                true,
                            "border-error text-error": error,
                            "border-base-300 text-opacity-80 text-base-content": !error,
                        })}
                    >
                        <PlusIcon className="h-10 w-10" />
                        <div className="text-center text-xs">Add Images</div>
                    </div>
                )}
            </div>
            {error && <div className="mt-2 text-xs text-error">{error}</div>}
        </>
    );
});
ImageUpload.displayName = "ImageUpload";
