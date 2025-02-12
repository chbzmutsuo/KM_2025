import Axios from 'src/cm/lib/axios'
import {S3_API_FormData} from '@pages/api/S3'
import {extType, MediaType} from '@cm/types/file-types'
import {requestResultType} from '@cm/types/types'

export type fileType = {mediaType: MediaType; ext: extType}
export class FileHandler {
  static mediaTypes: fileType[] = [
    {mediaType: 'image/jpeg', ext: '.jpg'},
    {mediaType: 'image/png', ext: '.png'},
    {mediaType: 'video/quicktime', ext: '.mov'},
    {mediaType: 'video/mp4', ext: '.mp4'},
    {mediaType: 'video/webm', ext: '.webm'},
    {mediaType: 'image/gif', ext: '.gif'},
    {mediaType: 'image/bmp', ext: '.bmp'},
    {mediaType: 'image/tiff', ext: '.tiff'},
    {mediaType: 'image/svg+xml', ext: '.svg'},
    {mediaType: 'audio/mpeg', ext: '.mp3'},
    {mediaType: 'audio/ogg', ext: '.ogg'},
    {mediaType: 'text/plain', ext: '.txt'},
    {mediaType: 'application/pdf', ext: '.pdf'},
    {mediaType: 'application/json', ext: '.json'},
    {mediaType: 'application/xml', ext: '.xml'},
    {mediaType: 'text/html', ext: '.html'},
    {mediaType: 'text/css', ext: '.css'},
  ]

  static sendFileToS3 = async (props: {file: any; formDataObj: S3_API_FormData}) => {
    const {file, formDataObj} = props
    const formData = new FormData()
    formData.append('file', file)
    Object.keys(formDataObj).forEach(key => {
      formData.append(key, formDataObj[key])
    })

    //これは、S3へのアップロードを行うAPIのため、fetchAltなどは使わない
    const result: requestResultType = await Axios.post(`/api/S3`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }).then(res => res.data)

    return result
  }
}
