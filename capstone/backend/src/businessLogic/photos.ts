import { searchUnsplashByKeyword } from '../unsplash/unsplashService'
import { createLogger } from '../utils/logger'
import { PhotoItem } from '../models/PhotoItem'
import { StorePhotoRequest } from '../requests/StorePhotoRequest'
import { PhotosAccess } from '../dataLayer/photosAccess'
import { parseUserId } from '../auth/utils'
const logger = createLogger('photos')

const photosAccess = new PhotosAccess()

export async function searchPhotos(keyword: string): Promise<PhotoItem[]> {

    const response = await searchUnsplashByKeyword(keyword)
    logger.info(response)

    let photoItems: PhotoItem[] = []

    for(var i = 0; i < response.results.length; i++) {
        photoItems.push({
            photoId: response.results[i].id,
            thumbUrl: response.results[i].urls.thumb,
            description: response.results[i].alt_description,
            photographerName: response.results[i].user.username
        })
    }

    return photoItems
}

export async function storePhoto(jwtToken: string, storeRequest: StorePhotoRequest): Promise<PhotoItem> {

    const userId = parseUserId(jwtToken)

    return await photosAccess.storePhoto({
        photoId: storeRequest.photoId,
        thumbUrl: storeRequest.thumbUrl,
        description: storeRequest.description,
        photographerName: storeRequest.photographerName,
        userId: userId,
        timestamp: new Date().toISOString()
    })
}

export async function getPhotos(jwtToken: string) {
    const userId = parseUserId(jwtToken)

    return photosAccess.getPhotosPerUser(userId)
}