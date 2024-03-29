﻿//image files
function deleteImageService(fileName) {
    return new Promise((resolve, reject) => {
        $.ajax({
            type: "POST",
            url: '/Templates/iPosters/iPosterService.asmx/DeleteRepositoryImage',
            data: JSON.stringify({ image: fileName }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                resolve(data);
            },
            error: function (error) {
                reject(error)
            },
        });
    });
}
function saveImageMetaDataService(imageData) {

    return new Promise((resolve, reject) => {
        $.ajax({
            type: "POST",
            url: '/Templates/iPosters/iPosterService.asmx/SaveImageMetaData',
            data: JSON.stringify({ uploadedImageMetaData: imageData }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                resolve(data.d);
            },
            error: function (error) {
                reject(error)
            },
        });
    });
}
function getImageServiceConfiguration(posterId) {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: '/Templates/iPosters/iPosterService.asmx/GetImageServiceConfiguration',
            type: 'POST',
            data: JSON.stringify({ posterId: posterId }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                resolve(data.d);
            },
            error: function (error) {
                reject(error);
            },
        })
    })
}
function getCloudinaryImageSignatureService(dynamicCloudinaryStorrageFolderPath) {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: '/Templates/iPosters/iPosterService.asmx/GenerateCloudinaryImageSignature',
            type: 'POST',
            data: JSON.stringify({ dynamicCloudinaryStorrageFolderPath: dynamicCloudinaryStorrageFolderPath }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                resolve(data.d);
            },
            error: function (error) {
                reject(error);
            },
        })
    })
}

//audio files
function deleteAudioFileService(fileName) {
    return new Promise((resolve, reject) => {
        $.ajax({
            type: "POST",
            url: '/Templates/iPosters/iPosterService.asmx/DeleteRepositoryAudio',
            data: JSON.stringify({ audio: fileName }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                resolve(data);
            },
            error: function (error) {
                reject(error)
            },
        });
    });
}
function saveAudioFileMetaDataService(audioData) {

    return new Promise((resolve, reject) => {
        $.ajax({
            type: "POST",
            url: '/Templates/iPosters/iPosterService.asmx/SaveAudioFileMetaDataService',
            data: JSON.stringify({ uploadedAudioFileMetaData: audioData }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                resolve(data.d);
            },
            error: function (error) {
                reject(error)
            },
        });
    });
}
function getAudioFileServiceConfiguration(posterId) {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: '/Templates/iPosters/iPosterService.asmx/GetAudioFileServiceConfiguration',
            type: 'POST',
            data: JSON.stringify({ posterId: posterId }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                resolve(data.d);
            },
            error: function (error) {
                reject(error);
            },
        })
    })
}
function getCloudinaryAudioSignatureService(dynamicCloudinaryStorrageFolderPath) {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: '/Templates/iPosters/iPosterService.asmx/GenerateCloudinaryAudioSignature',
            type: 'POST',
            data: JSON.stringify({ dynamicCloudinaryStorrageFolderPath: dynamicCloudinaryStorrageFolderPath }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                resolve(data.d);
            },
            error: function (error) {
                reject(error);
            },
        })
    })
}

//video files
function deleteVideoFileService(videoId) {
    return new Promise((resolve, reject) => {
        $.ajax({
            type: "POST",
            url: '/Templates/iPosters/iPosterService.asmx/DeleteRepositoryVideo',
            data: JSON.stringify({ id: videoId }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                resolve(data);
            },
            error: function (error) {
                reject(error)
            },
        });
    });
}
function deleteVideoPresentationFileService(videoUrl) {
    return new Promise((resolve, reject) => {
        $.ajax({
            type: "POST",
            url: '/Templates/iPosters/iPosterService.asmx/DeleteVideoPresentation',
            data: JSON.stringify({ url: videoUrl }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                resolve(data);
            },
            error: function (error) {
                reject(error)
            },
        });
    });
}
function saveVideoFileMetaDataService(videoData) {

    return new Promise((resolve, reject) => {
        $.ajax({
            type: "POST",
            url: '/Templates/iPosters/iPosterService.asmx/SaveVideoFileMetaDataService',
            data: JSON.stringify({ uploadedVideoFileMetaData: videoData }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                resolve(data.d);
            },
            error: function (error) {
                reject(error)
            },
        });
    });
}
function getVideoFileServiceConfiguration(posterId) {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: '/Templates/iPosters/iPosterService.asmx/GetVideoFileServiceConfiguration',
            type: 'POST',
            data: JSON.stringify({ posterId: posterId }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                resolve(data.d);
            },
            error: function (error) {
                reject(error);
            },
        })
    })
}
function getUploadedVideoFilesService() {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: '/Templates/iPosters/iPosterService.asmx/GetUploadedVideoFilesByCurrentUser',
            type: 'POST',
            data: JSON.stringify({ count: null }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                resolve(data.d);
            },
            error: function (error) {
                reject(error);
            },
        })
    })
}
function updateMediaItemDataService(mediaId, mediaTitle, mediaDescription) {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: '/Templates/iPosters/iPosterService.asmx/UpdateMediaItemData',
            type: 'POST',
            data: JSON.stringify({ id: mediaId, title: mediaTitle, description: mediaDescription}),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                resolve(data.d);
            },
            error: function (error) {
                reject(error);
            },
        })
    })
}
function getCloudinaryVideoSignatureService(dynamicCloudinaryStorrageFolderPath, usedInUploaderWidget) {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: '/Templates/iPosters/iPosterService.asmx/GenerateCloudinaryVideoSignature',
            type: 'POST',
            data: JSON.stringify({ dynamicCloudinaryStorrageFolderPath: dynamicCloudinaryStorrageFolderPath, usedInUploaderWidget: usedInUploaderWidget }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                resolve(data.d);
            },
            error: function (error) {
                reject(error);
            },
        })
    })
}

