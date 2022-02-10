import React, { useState, useEffect } from 'react';
import config from 'src/commons/config-hoc';
import { PageContent } from 'src/commons/ra-lib';

import { Upload, Button, message } from 'antd';
import { UploadOutlined, LoadingOutlined, PlusOutlined } from '@ant-design/icons';


export default config({
    path: '/upload',
    title: { text: '上传文件', icon: 'align-left' },
    side: true,
})(props => {
    const [defaultFileList, setDefaultFileList] = useState([]);
    const [imageUrl, setImgUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const uploadFetch = {
        name: 'file',
        action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
        headers: {
            authorization: 'authorization-text',
        },
        defaultFileList: defaultFileList,
        onChange(info) {
            console.log(info);
            if (info.file.status !== 'uploading') {
                console.log(info.file, info.fileList);
            }
            if (info.file.status === 'done') {
                message.success(`${info.file.name} file uploaded successfully`);
            } else if (info.file.status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
            }
        },
    };
    const uploadImg = {
        name: 'img',
        listType: "picture-card",
        className: "avatar-uploader",
        showUploadList: false,
        action: "https://www.mocky.io/v2/5cc8019d300000980a055e76",
        beforeUpload: beforeUpload,
        onChange(info) {
            if (info.file.status === 'uploading') {//开始上传  
                setLoading({
                    loading: false
                });
                return;
            }
            if (info.file.status === 'done') {//上传成功
                getBase64(info.file.originFileObj, imageUrlData => {
                    setLoading({ loading: false });
                    setImgUrl({ imageUrl: imageUrlData })
                })
            }
        }
    }
    const beforeUpload = info => {
        console.log(info);
    }
    const uploadButton = () => {
        return (
            <div>
                {loading ? <LoadingOutlined /> : <PlusOutlined />}
                <div style={{ marginTop: 8 }}>Upload</div>
            </div>
        )
    }
    const getBase64 = (img, callback) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
    }
    async function fetchData() {
        setDefaultFileList((res) => {
            defaultFileList.push(
                {
                    uid: '1',
                    name: 'xxx.png',
                    status: 'done',
                    response: 'Server Error 500', // custom error message to show
                    url: 'http://www.baidu.com/xxx.png',
                },
                {
                    uid: '2',
                    name: 'xx1x.png',
                    status: 'done',
                    response: 'Server Error 500', // custom error message to show
                    url: 'http://www.baidu.com/xxx.png',
                },
            )
        })
    }
    useEffect(() => {
        (async () => {
            await fetchData();
        })();
    }, []);
    return (
        <PageContent fitHeight>
            <Upload {...uploadFetch} >
                <Button icon={<UploadOutlined />}>上传文件</Button>
            </Upload>

            <Upload {...uploadImg} >
                {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
            </Upload>
        </PageContent>
    );
});
