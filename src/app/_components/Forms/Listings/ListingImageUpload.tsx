"use client";

import { useEffect, forwardRef } from "react";
import { useDropzone } from "react-dropzone";
import { ListingImage } from "@/app/_components/Common";
import { PlusIcon, XCircleIcon } from "@/icons";
import clsx from "clsx";
import { VehicleImageType } from "@/utils/types";
import { MaxVehicleImageCount } from "@/utils/constants";
import Image from "next/image";

interface Props {
    files?: VehicleImageType[];
    setFiles?: (images: VehicleImageType[]) => void;
    loading?: boolean;
    loadingPlaceholderCount?: number;
    error?: string;
    title?: string;
}

export const ListingImageUpload = forwardRef<HTMLInputElement, Props>((props, formRef) => {
    const { files = [], setFiles = () => {}, loading, error, loadingPlaceholderCount = 1, title } = props;
    const { getRootProps, getInputProps, open } = useDropzone({
        accept: { "image/*": [] },
        disabled: loading,
        multiple: true,
        noClick: true,
        noKeyboard: true,
        onDrop: (acceptedFiles) => {
            const newFileList: VehicleImageType[] = [
                ...files,
                ...acceptedFiles.map((file) => ({ file, preview: URL.createObjectURL(file), deleted: false })),
            ];
            if (newFileList.length > 0 && !newFileList.some((item) => item.isThumbnail && !item.deleted)) {
                const thumbnailIndex = newFileList.findIndex((item) => !item.deleted);
                if (thumbnailIndex >= 0 && newFileList[thumbnailIndex]) {
                    newFileList[thumbnailIndex]!.isThumbnail = true;
                }
            }
            setFiles(newFileList);
        },
    });

    const removeImage = (indexToRemove: number) => {
        if (indexToRemove >= 0 && indexToRemove < files.length) {
            let newFileList = files.map((item, index) => (index === indexToRemove ? { ...item, deleted: true, isThumbnail: false } : item));
            let thumbnailIndex = newFileList.findIndex((item) => !item.deleted && item.isThumbnail);
            if (thumbnailIndex < 0) {
                thumbnailIndex = newFileList.findIndex((item) => !item.deleted);
            }
            newFileList = newFileList.map((item, index) => (index === thumbnailIndex ? { ...item, isThumbnail: true } : item));
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
            <input ref={formRef} className="h-0 w-0" />
            <div className="mt-2 flex flex-wrap gap-2" {...getRootProps({})}>
                {files?.map((file, index) => {
                    if (file.deleted) {
                        return null;
                    }
                    return (
                        <div
                            className="rounded-box relative box-border inline-flex aspect-square w-[calc(33%-6px)] border-[1px] border-base-300 hover:shadow sm:w-[calc(25%-6px)] md:w-[calc(20%-8px)] xl:w-[calc(25%-6px)]"
                            key={`${index}-${file.name}`}
                        >
                            <div
                                className={clsx({
                                    "rounded-box h-full w-full overflow-hidden": true,
                                    "grayscale-0": file.isThumbnail,
                                    "grayscale-[30%]": !file.isThumbnail,
                                })}
                            >
                                {file.preview ? (
                                    <Image
                                        src={file.preview}
                                        alt="Image-preview"
                                        unoptimized
                                        height={100}
                                        width={100}
                                        className="box-border block h-full w-full overflow-hidden bg-base-300 object-cover"
                                    />
                                ) : (
                                    <ListingImage
                                        image={file}
                                        title={title || `new-listing-image-${index}`}
                                        height={100}
                                        width={100}
                                        className="box-border block h-full w-full overflow-hidden bg-base-300 object-cover"
                                    />
                                )}
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
                                className="rounded-box flex aspect-square w-[calc(33%-6px)] animate-pulse cursor-progress flex-col items-center justify-center border border-dashed bg-base-200 sm:w-[calc(25%-6px)] md:w-[calc(20%-8px)] xl:w-[calc(25%-6px)]"
                            />
                        ))}
                    </>
                ) : (
                    <>
                        {files.filter((item) => !item.deleted).length < MaxVehicleImageCount && (
                            <div
                                onClick={open}
                                className={clsx({
                                    "rounded-box flex aspect-square w-[calc(33%-6px)] sm:w-[calc(25%-6px)] md:w-[calc(20%-8px)] xl:w-[calc(25%-6px)] cursor-pointer flex-col items-center justify-center border border-dashed  bg-base-200 p-0 sm:p-2 duration-150 hover:bg-base-300":
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
ListingImageUpload.displayName = "ImageUpload";
