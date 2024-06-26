﻿var cloudImageService = null;
var cloudAudioFileService = null;
var cloudVideoFileService = null;

let posterShortName = $("#PageShortName").val();

getImageServiceConfiguration(posterShortName).then(config => {
    cloudImageService = new CloudImageService(config);
});

getAudioFileServiceConfiguration(posterShortName).then(config => {
    cloudAudioFileService = new CloudAudioFileService(config);
});

getVideoFileServiceConfiguration(posterShortName).then(config => {
    cloudVideoFileService = new CloudVideoFileService(config);
});

class CloudImageService {

    get isActive() {
        return this.configuration && this.configuration.isActive == true;
    }
    get directUploadUrl() {
        return this.configuration.directUploadUrl;
    }
    constructor(config) {
        this.signatureObject = null;
        this.configuration = config;
        if (!config.isActive)
            return;

        this.getCloudinarySignature();

        //renew signature every 50 minues
        this.signatureInterval = setInterval(() => this.getCloudinarySignature(), 3000000);
    }
    getAllowedFormats() {
        return this.configuration.allowedFormats;
    }
    getCloudinarySignature() {
        //storrage folder path is dynamic so we need to pass it to get a valid signature
        getCloudinaryImageSignatureService(this.configuration.storageFolderPath).then(data => {
            this.signatureObject = data;
        }).catch(error => {
            console.log(error);
        });

    }
    extractImageMetaData(uploadImageResponse) {
        return new Promise((resolve, reject) => {
            uploadImageResponse.json().then(data => {
                let imageMetaData = generateImageMetaDataObject(data);
                resolve(imageMetaData);
            }).catch(error => {
                reject(error);
            });
        });
    }
    generateImageMetaDataObject(data) {

        return {
            AssetId: data.asset_id,
            Bytes: data.bytes,
            PublicId: data.public_id,
            CreatedAt: data.created_at,
            Etag: data.etag,
            Format: data.format,
            Height: data.height,
            OriginalFileName: data.original_filename + '.' + data.format,
            Tags: data.tags,
            Width: data.width,
            Version: data.version,
            SecureUrl: data.secure_url,
            Url: data.url,

        }
    }
    provideSignedUploadFormData(formData, file) {
        formData.append("file", file);
        formData.append("api_key", this.configuration.apiKey);
        formData.append("timestamp", this.signatureObject.timestamp);
        formData.append("signature", this.signatureObject.signature);

        if (this.configuration.storageFolderPath)
            formData.append("folder", this.configuration.storageFolderPath);

        if (this.configuration.makeFileNamesUniqueByAddingSuffix)
            formData.append("unique_filename", this.configuration.makeFileNamesUniqueByAddingSuffix);

        if (this.configuration.saveFilesWithOriginalFilename)
            formData.append("use_filename", this.configuration.saveFilesWithOriginalFilename);

        if (this.configuration.allowedFormats)
            formData.append("allowed_formats", this.configuration.allowedFormats);

        if (this.configuration.overwriteExistingFiles)
            formData.append("overwrite", this.configuration.overwriteExistingFiles);

        return formData;
    }
    submitSignedFileDirectlyToCloud(file, responseDataHandler, targetControl) {

        const url = this.configuration.directUploadUrl;
        const formData = this.provideSignedUploadFormData(new FormData(), file);

        fetch(url, {
            method: "POST",
            body: formData
        }).then((response) => {
            if (responseDataHandler)
                responseDataHandler(response, file, targetControl);
        }).catch(error => {
            throw error;
        });
    }
    isImageFile(src) {
        var re = new RegExp('/' + this.configuration.cloudName + '/image/upload/', 'i');
        if (src.match(re)) return true;
        else return false;;
    }
}

class CloudAudioFileService {

    get isActive() {
        return this.configuration && this.configuration.isActive == true;
    }
    get directUploadUrl() {
        return this.configuration.directUploadUrl;
    }
    constructor(config) {
        this.signatureObject = null;
        this.configuration = config;
        if (!config.isActive)
            return;

        this.getCloudinarySignature();

        //renew signature every 50 minues
        this.signatureInterval = setInterval(() => this.getCloudinarySignature(), 3000000);
    }
    getAllowedFormats() {
        return this.configuration.allowedFormats;
    }
    getCloudinarySignature() {
        //storrage folder path is dynamic so we need to pass it to get a valid signature
        getCloudinaryAudioSignatureService(this.configuration.storageFolderPath).then(data => {
            this.signatureObject = data;
        }).catch(error => {
            console.log(error);
        });

    }
    extractAudioFileMetaData(uploadAudioFileResponse) {
        return new Promise((resolve, reject) => {
            uploadAudioFileResponse.json().then(data => {
                let audioFileMetaData = generateAudioFileMetaDataObject(data);
                resolve(audioFileMetaData);
            }).catch(error => {
                reject(error);
            });
        });
    }
    generateAudioFileMetaDataObject(data) {

        return {
            AssetId: data.asset_id,
            Bytes: data.bytes,
            PublicId: data.public_id,
            CreatedAt: data.created_at,
            Etag: data.etag,
            Format: data.format,
            OriginalFileName: data.original_filename + '.' + data.format,
            Tags: data.tags,
            Version: data.version,
            SecureUrl: data.secure_url,
            Url: data.url,
        }
    }
    provideSignedUploadFormData(formData, file) {
        let isMp3FileFormat = file.name.endsWith('.mp3');
        formData.append("file", file);
        formData.append("api_key", this.configuration.apiKey);
        formData.append("timestamp", this.signatureObject.timestamp);
        formData.append("signature", isMp3FileFormat && this.signatureObject.mp3FileSignature ? this.signatureObject.mp3FileSignature : this.signatureObject.signature);

        if (this.configuration.storageFolderPath)
            formData.append("folder", this.configuration.storageFolderPath);

        if (this.configuration.makeFileNamesUniqueByAddingSuffix)
            formData.append("unique_filename", this.configuration.makeFileNamesUniqueByAddingSuffix);

        if (this.configuration.saveFilesWithOriginalFilename)
            formData.append("use_filename", this.configuration.saveFilesWithOriginalFilename);

        if (this.configuration.allowedFormats)
            formData.append("allowed_formats", this.configuration.allowedFormats);

        if (this.configuration.overwriteExistingFiles)
            formData.append("overwrite", this.configuration.overwriteExistingFiles);

        if (isMp3FileFormat && this.configuration.mp3FormatPreset)
            formData.append("upload_preset", this.configuration.mp3FormatPreset)

        return formData;
    }
    submitSignedFileDirectlyToCloud(file) {
        const url = this.configuration.directUploadUrl;
        const formData = this.provideSignedUploadFormData(new FormData(), file);

        return fetch(url, {
            method: "POST",
            body: formData
        });
    }
}

class CloudVideoFileService {
    getCloudinaryUploaderWidget(onUploadSuccessEvent, containerElement, statusChangedEvent) {
        return this.initializeCloudinaryVideoUploaderWidget(onUploadSuccessEvent, containerElement, statusChangedEvent);
    }
    get isActive() {
        return this.configuration && this.configuration.isActive == true;
    }
    get directUploadUrl() {
        return this.configuration.directUploadUrl;
    }
    constructor(config) {
        this.signatureObject = null;
        this.configuration = config;
        if (!config.isActive)
            return;

        this.getCloudinarySignature();

        //renew signature every 50 minues
        this.signatureInterval = setInterval(() => this.getCloudinarySignature(), 3000000);
    }
    getAllowedFormats() {
        return this.configuration.allowedFormats;
    }
    getCloudinarySignature() {
        //storrage folder path is dynamic so we need to pass it to get a valid signature
        getCloudinaryVideoSignatureService(this.configuration.storageFolderPath, this.configuration.useUploaderWidget).then(data => {
            this.signatureObject = data;
        }).catch(error => {
            console.log(error);
        });

    }
    extractVideoFileMetaData(uploadVideoFileResponse) {
        return new Promise((resolve, reject) => {
            uploadVideoFileResponse.json().then(data => {
                let videoFileMetaData = generateVideoFileMetaDataObject(data);
                resolve(videoFileMetaData);
            }).catch(error => {
                reject(error);
            });
        });
    }
    generateVideoFileMetaDataObject(data) {

        return {
            AssetId: data.asset_id,
            Bytes: data.bytes,
            PublicId: data.public_id,
            CreatedAt: data.created_at,
            Etag: data.etag,
            Format: data.format,
            OriginalFileName: data.original_filename + '.' + data.format,
            Tags: data.tags,
            Version: data.version,
            SecureUrl: data.secure_url,
            Url: data.url,
        }
    }
    provideSignedUploadFormData(formData, file) {
        formData.append("file", file);
        formData.append("api_key", this.configuration.apiKey);
        formData.append("timestamp", this.signatureObject.timestamp);
        formData.append("signature", this.signatureObject.signature);

        if (this.configuration.storageFolderPath)
            formData.append("folder", this.configuration.storageFolderPath);

        if (this.configuration.makeFileNamesUniqueByAddingSuffix)
            formData.append("unique_filename", this.configuration.makeFileNamesUniqueByAddingSuffix);

        if (this.configuration.saveFilesWithOriginalFilename)
            formData.append("use_filename", this.configuration.saveFilesWithOriginalFilename);

        if (this.configuration.allowedFormats)
            formData.append("allowed_formats", this.configuration.allowedFormats);

        if (this.configuration.overwriteExistingFiles)
            formData.append("overwrite", this.configuration.overwriteExistingFiles);

        return formData;
    }
    submitSignedFileDirectlyToCloud(file) {
        const url = this.configuration.directUploadUrl;
        const formData = this.provideSignedUploadFormData(new FormData(), file);

        return fetch(url, {
            method: "POST",
            body: formData
        });
    }
    initializeCloudinaryVideoUploaderWidget(onSuccessFunction, inlineContainer = undefined, uploaderStatusChangedEvent_Handler = undefined) {
        if (!this.isActive) {
            throw Error('Video streaming is disabled by settings.');
        }
        return cloudinary.createUploadWidget(
            {
                cloudName: this.configuration.cloudName,
                apiKey: this.configuration.apiKey,
                uploadSignatureTimestamp: this.signatureObject.timestamp,
                prepareUploadParams: (cb, params) => {
                    params["signature"] = this.signatureObject.signature;
                    params["resourceType"] = "video";
                    params["apiKey"] = this.configuration.apiKey;
                    params["useFilename"] = this.configuration.saveFilesWithOriginalFilename;
                    params["uniqueFilename"] = this.configuration.makeFileNamesUniqueByAddingSuffix;
                    params["overwrite"] = this.configuration.overwriteExistingFiles;
                    params["folder"] = this.configuration.storageFolderPath;
                    cb(params);
                },
                // the full list of possible parameters that you can add see:
                //   https://cloudinary.com/documentation/upload_widget_reference
                sources: ["local"], //, "google_drive", "dropbox", "url"
                multiple: false,
                maxFiles: 10,
                clientAllowedFormats: this.configuration.allowedFormats,
                maxVideoFileSize: 104857600, //needs to be read from configuration
                showPoweredBy: false,
                secure: true,
                autoMinimize: true,
                showCompletedButton: false,
                showUploadMoreButton: true,
                singleUploadAutoClose: true,
                queueViewPosition: 'left:35px',
                complete: function () { },
                text: {
                    "en": {
                        "queue": {
                            "done": "In progress..."
                        }
                    }
                },
                inlineContainer: inlineContainer,
                styles: {
                    palette: {
                        window: "#F5F5F5",
                        sourceBg: "#FFFFFF",
                        windowBorder: "#90a0b3",
                        tabIcon: "#0094c7",
                        inactiveTabIcon: "#69778A",
                        menuIcons: "#0094C7",
                        link: "#53ad9d",
                        action: "#DCDCDC",
                        inProgress: "#0194c7",
                        complete: "#53ad9d",
                        error: "#c43737",
                        textDark: "#000000",
                        textLight: "#FFFFFF"
                    }
                }
            },
            (error, result) => {
                if (!error) {
                    if (result) {
                        console.log(result);
                        if (result.event === "success") {

                            if (!onSuccessFunction) {
                                console.error('UploaderWidget -> onSuccessFunction is not defined!');
                            }
                            else {
                                onSuccessFunction(result.info);
                            }
                        }
                        if (uploaderStatusChangedEvent_Handler)
                            uploaderStatusChangedEvent_Handler(result.event);
                    }
                }

                else {
                    if (uploaderStatusChangedEvent_Handler)
                        uploaderStatusChangedEvent_Handler("error");
                }
            }
        );
    }
}
