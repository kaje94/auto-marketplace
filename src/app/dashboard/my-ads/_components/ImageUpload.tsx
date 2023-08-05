"use client";

import { useEffect, forwardRef } from "react";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import { PlusIcon, XCircleIcon, XIcon } from "@/icons";
import clsx from "clsx";
import { ImageFile } from "@/utils/types";
import { cn } from "@/utils/helpers";
import { MaxVehicleImageCount } from "@/utils/constants";

interface Props {
    files?: ImageFile[];
    setFiles?: (images: ImageFile[]) => void;
    loading?: boolean;
    loadingPlaceholderCount?: number;
    error?: string;
}

export const ImageUpload = forwardRef<HTMLInputElement, Props>((props, _formRef) => {
    const { files = [], setFiles = () => {}, loading, error, loadingPlaceholderCount = 1 } = props;
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
            <div className="mt-2 flex flex-wrap gap-2" {...getRootProps({})}>
                {files?.map((file, index) => {
                    return (
                        <div className="rounded-box relative box-border inline-flex h-24 w-24 hover:shadow" key={`${index}-${file.name}`}>
                            <div
                                className={clsx({
                                    "rounded-box h-full w-full overflow-hidden": true,
                                    "grayscale-0": file.isThumbnail,
                                    "grayscale-[30%]": !file.isThumbnail,
                                })}
                            >
                                <Image
                                    src={file.preview || file.url || ""}
                                    height={100}
                                    width={100}
                                    unoptimized={!!file.preview}
                                    alt="Image-preview"
                                    className="box-border block h-full w-full overflow-hidden bg-base-300 object-cover"
                                    // todo: use blurDataURL when editing uploaded items
                                />
                            </div>

                            <div className="rounded-box absolute right-0 top-0 z-20 flex h-full w-full items-center justify-center opacity-100 transition-opacity duration-200 hover:opacity-100 xl:opacity-0">
                                <button
                                    className="btn-error btn-xs btn-circle btn absolute -right-2 -top-2 z-20 flex items-center justify-center text-error-content hover:text-base-300"
                                    onClick={(event) => {
                                        removeImage(index);
                                        event.preventDefault();
                                    }}
                                >
                                    <XCircleIcon className="h-full w-full" strokeWidth={2.5} />
                                </button>

                                {!file.isThumbnail && (
                                    <button
                                        onClick={(event) => {
                                            if (!file.isThumbnail) {
                                                setFiles(files.map((item, i) => ({ ...item, isThumbnail: index === i })));
                                            }
                                            event.preventDefault();
                                        }}
                                        className="h-full w-full cursor-pointer"
                                    >
                                        <span className="rounded-box absolute inset-x-0 bottom-0 rounded-t-none bg-base-content bg-opacity-70 py-1 text-center text-xs font-medium text-base-100 xl:bg-opacity-90 ">
                                            Set as Thumbnail
                                        </span>
                                    </button>
                                )}
                            </div>
                            {file.isThumbnail && (
                                <span className="rounded-box absolute inset-x-0 bottom-0 rounded-t-none bg-secondary bg-opacity-80 py-1 text-center text-xs  font-bold text-secondary-content xl:bg-opacity-90">
                                    Thumbnail
                                </span>
                            )}
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
                    <>
                        {files.length < MaxVehicleImageCount && (
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
                    </>
                )}
            </div>
            {error && <div className="mt-2 text-xs text-error">{error}</div>}
        </>
    );
});
ImageUpload.displayName = "ImageUpload";
