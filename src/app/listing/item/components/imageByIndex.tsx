const image1 =
  "https://uscarsales.lk/erp/carsale/website/SHOWROOM/CAY-8249_20210205_10_29_26IMG-20210205-WA0000.jpg";
const image2 = "https://autostore.nyc3.cdn.digitaloceanspaces.com/11867_0.jpg";
const image3 = "https://autostore.nyc3.cdn.digitaloceanspaces.com/6652_0.jpg";
const image4 =
  "https://www.auto-lanka.com/img.web/UserImage/220109040215/image_5fc0cab9c08850daa9c750292505198f9a8662880fe5da9441be1b3dc8cc41bb.jpg";

export const images: string[] = [image1, image2, image3, image4];

const imageByIndex = (index: number): string => images[index % images.length];

export default imageByIndex;
