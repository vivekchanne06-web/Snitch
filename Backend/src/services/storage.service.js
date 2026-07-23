import ImageKit, { toFile } from "@imagekit/nodejs";
import { config } from '../config/config.js';

const Client = new ImageKit({

    privateKey: config.IMAGEKIT_API_KEY,

})


export async function uploadImage({buffer, fileName, folder = "Snitch"}) {

    console.log(buffer);
    console.log(Buffer.isBuffer(buffer));

    const result = await Client.files.upload({
        file: await ImageKit.toFile(buffer),
        fileName,
        folder
    });
    return result;
}

