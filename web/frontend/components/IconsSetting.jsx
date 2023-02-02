import {
    Card,
    Layout,
    Stack,
    Heading, Banner, Select, TextField, Button, ButtonGroup, Form, FormLayout, Icon, Loading, Frame,
} from "@shopify/polaris";
import {TitleBar} from "@shopify/app-bridge-react";
import {useCallback, useEffect, useState} from "react";
import {DragDropContext, Droppable, Draggable} from "react-beautiful-dnd";
import {useForm, useField, notEmptyString} from "@shopify/react-form";
import {useAuthenticatedFetch} from "../hooks";

/*import {DeleteMinor, PlusMinor} from '@shopify/polaris-icons';
import {FacebookIcon} from "../assets"*/


export default function IconsSetting(){
    const [showTitleBar, setShowTitleBar] = useState(true);
    const [showSelectOption, setShowSelectOption] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [mediaIcon, setMediaIcon] = useState({title: "", iconLink: "", icon: "", color: '#ffffff', })
    const [socialMediaIconList, setSocialMediaIconList] = useState([]);
    const [updatedMediaIconList, setUpdatedMediaIconList] = useState([]);
    const [shop, setShop] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const fetch = useAuthenticatedFetch();

    const scriptTag = useCallback(
        async () => {
            const url = `/api/create-script-tag`;
            const method = "GET";
            const response = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json"
                },
            });
        }, []
    )

    const list = useCallback(
        async () => {
            const url = `/api/media_icons/links`;
            const method = "GET";
            const response = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json"
                },
            });
            if (response.ok) {
                const data = await response.json();
                setSocialMediaIconList(data)
                setUpdatedMediaIconList(data)
            }
        }, [socialMediaIconList]);

    const getGeneralSettings = useCallback(
        async () => {
            const url = "/api/media_icons/shops";
            const method = "GET";
            const response = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json"
                }
            });
            if(response.ok) {
                const data = await response.json();
                const shop = {"position": "Bottom Right", "shape": "circle", "appStatus": "App enabled" };
                if (data.length === 0) {
                    const response = await fetch("/api/media_icons/shops", {
                        method: "POST",
                        body: JSON.stringify(shop),
                        headers: {
                            "Content-Type": "application/json"
                        }
                    });
                    if (response.ok) {
                        const data = await response.json();
                        setShop(data[0])
                    }
                } else {
                    setShop(data[0])
                }
            }
        }, []);

    useEffect(() => {
        getGeneralSettings().then();
        list().then();
        scriptTag().then();
    }, []);


    const onSubmit = useCallback(
        (body) => {
            setIsLoading(true);
            (async () => {
                const parsedBody = body;
                const url = "/api/media_icons/links";
                const method = "POST";
                const response = await fetch(url, {
                    method,
                    body: JSON.stringify(parsedBody),
                    headers: {
                        "Content-Type": "application/json"
                    },
                });
                if (response.ok) {
                    makeClean();
                    const url = `/api/media_icons/links`;
                    const method = "GET";
                    const response = await fetch(url, {
                        method,
                        headers: {
                            "Content-Type": "application/json"
                        },
                    });
                    if (response.ok) {
                        const data = await response.json();
                        setSocialMediaIconList(data)
                        setUpdatedMediaIconList(data)
                        setIsLoading(false);
                    }
                }
            })();
            reset()
            setShowForm(false);
            setShowTitleBar(true);
            return {status: "success"};
        },
        [mediaIcon, setMediaIcon]
    );

    const onAddBtnClick = () => {
        setShowTitleBar(false);
        setShowForm(true);
    };
    const cancelBtnClick = () => {
        reset();
        setShowForm(false);
        setShowTitleBar(true);
    };

    const titleOptions = [
        {
            label: 'select',
            value: ''
        },
        {
            label: 'facebook',
            value: 'facebook',
            prefix: <Icon
                source='<svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 24 24" width="24px" height="24px"><path d="M 12 2 C 6.4889971 2 2 6.4889971 2 12 C 2 17.511003 6.4889971 22 12 22 C 17.511003 22 22 17.511003 22 12 C 22 6.4889971 17.511003 2 12 2 z M 12 4 C 16.430123 4 20 7.5698774 20 12 C 20 16.014467 17.065322 19.313017 13.21875 19.898438 L 13.21875 14.384766 L 15.546875 14.384766 L 15.912109 12.019531 L 13.21875 12.019531 L 13.21875 10.726562 C 13.21875 9.7435625 13.538984 8.8710938 14.458984 8.8710938 L 15.935547 8.8710938 L 15.935547 6.8066406 C 15.675547 6.7716406 15.126844 6.6953125 14.089844 6.6953125 C 11.923844 6.6953125 10.654297 7.8393125 10.654297 10.445312 L 10.654297 12.019531 L 8.4277344 12.019531 L 8.4277344 14.384766 L 10.654297 14.384766 L 10.654297 19.878906 C 6.8702905 19.240845 4 15.970237 4 12 C 4 7.5698774 7.5698774 4 12 4 z"/></svg>'/>,
        },
        {
            label: 'instagram',
            value: 'instagram',
            prefix: <Icon
                source='<svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 24 24" width="24px" height="24px">    <path d="M 8 3 C 5.243 3 3 5.243 3 8 L 3 16 C 3 18.757 5.243 21 8 21 L 16 21 C 18.757 21 21 18.757 21 16 L 21 8 C 21 5.243 18.757 3 16 3 L 8 3 z M 8 5 L 16 5 C 17.654 5 19 6.346 19 8 L 19 16 C 19 17.654 17.654 19 16 19 L 8 19 C 6.346 19 5 17.654 5 16 L 5 8 C 5 6.346 6.346 5 8 5 z M 17 6 A 1 1 0 0 0 16 7 A 1 1 0 0 0 17 8 A 1 1 0 0 0 18 7 A 1 1 0 0 0 17 6 z M 12 7 C 9.243 7 7 9.243 7 12 C 7 14.757 9.243 17 12 17 C 14.757 17 17 14.757 17 12 C 17 9.243 14.757 7 12 7 z M 12 9 C 13.654 9 15 10.346 15 12 C 15 13.654 13.654 15 12 15 C 10.346 15 9 13.654 9 12 C 9 10.346 10.346 9 12 9 z"/></svg>'/>,
        },
        {
            label: 'twitter',
            value: 'twitter',
            prefix: <Icon
                source='<svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 50 50" width="50px" height="50px"><path d="M 34.21875 5.46875 C 28.238281 5.46875 23.375 10.332031 23.375 16.3125 C 23.375 16.671875 23.464844 17.023438 23.5 17.375 C 16.105469 16.667969 9.566406 13.105469 5.125 7.65625 C 4.917969 7.394531 4.597656 7.253906 4.261719 7.277344 C 3.929688 7.300781 3.632813 7.492188 3.46875 7.78125 C 2.535156 9.386719 2 11.234375 2 13.21875 C 2 15.621094 2.859375 17.820313 4.1875 19.625 C 3.929688 19.511719 3.648438 19.449219 3.40625 19.3125 C 3.097656 19.148438 2.726563 19.15625 2.425781 19.335938 C 2.125 19.515625 1.941406 19.839844 1.9375 20.1875 L 1.9375 20.3125 C 1.9375 23.996094 3.84375 27.195313 6.65625 29.15625 C 6.625 29.152344 6.59375 29.164063 6.5625 29.15625 C 6.21875 29.097656 5.871094 29.21875 5.640625 29.480469 C 5.410156 29.742188 5.335938 30.105469 5.4375 30.4375 C 6.554688 33.910156 9.40625 36.5625 12.9375 37.53125 C 10.125 39.203125 6.863281 40.1875 3.34375 40.1875 C 2.582031 40.1875 1.851563 40.148438 1.125 40.0625 C 0.65625 40 0.207031 40.273438 0.0507813 40.71875 C -0.109375 41.164063 0.0664063 41.660156 0.46875 41.90625 C 4.980469 44.800781 10.335938 46.5 16.09375 46.5 C 25.425781 46.5 32.746094 42.601563 37.65625 37.03125 C 42.566406 31.460938 45.125 24.226563 45.125 17.46875 C 45.125 17.183594 45.101563 16.90625 45.09375 16.625 C 46.925781 15.222656 48.5625 13.578125 49.84375 11.65625 C 50.097656 11.285156 50.070313 10.789063 49.777344 10.445313 C 49.488281 10.101563 49 9.996094 48.59375 10.1875 C 48.078125 10.417969 47.476563 10.441406 46.9375 10.625 C 47.648438 9.675781 48.257813 8.652344 48.625 7.5 C 48.75 7.105469 48.613281 6.671875 48.289063 6.414063 C 47.964844 6.160156 47.511719 6.128906 47.15625 6.34375 C 45.449219 7.355469 43.558594 8.066406 41.5625 8.5 C 39.625 6.6875 37.074219 5.46875 34.21875 5.46875 Z M 34.21875 7.46875 C 36.769531 7.46875 39.074219 8.558594 40.6875 10.28125 C 40.929688 10.53125 41.285156 10.636719 41.625 10.5625 C 42.929688 10.304688 44.167969 9.925781 45.375 9.4375 C 44.679688 10.375 43.820313 11.175781 42.8125 11.78125 C 42.355469 12.003906 42.140625 12.53125 42.308594 13.011719 C 42.472656 13.488281 42.972656 13.765625 43.46875 13.65625 C 44.46875 13.535156 45.359375 13.128906 46.3125 12.875 C 45.457031 13.800781 44.519531 14.636719 43.5 15.375 C 43.222656 15.578125 43.070313 15.90625 43.09375 16.25 C 43.109375 16.65625 43.125 17.058594 43.125 17.46875 C 43.125 23.71875 40.726563 30.503906 36.15625 35.6875 C 31.585938 40.871094 24.875 44.5 16.09375 44.5 C 12.105469 44.5 8.339844 43.617188 4.9375 42.0625 C 9.15625 41.738281 13.046875 40.246094 16.1875 37.78125 C 16.515625 37.519531 16.644531 37.082031 16.511719 36.683594 C 16.378906 36.285156 16.011719 36.011719 15.59375 36 C 12.296875 35.941406 9.535156 34.023438 8.0625 31.3125 C 8.117188 31.3125 8.164063 31.3125 8.21875 31.3125 C 9.207031 31.3125 10.183594 31.1875 11.09375 30.9375 C 11.53125 30.808594 11.832031 30.402344 11.816406 29.945313 C 11.800781 29.488281 11.476563 29.097656 11.03125 29 C 7.472656 28.28125 4.804688 25.382813 4.1875 21.78125 C 5.195313 22.128906 6.226563 22.402344 7.34375 22.4375 C 7.800781 22.464844 8.214844 22.179688 8.355469 21.746094 C 8.496094 21.3125 8.324219 20.835938 7.9375 20.59375 C 5.5625 19.003906 4 16.296875 4 13.21875 C 4 12.078125 4.296875 11.03125 4.6875 10.03125 C 9.6875 15.519531 16.6875 19.164063 24.59375 19.5625 C 24.90625 19.578125 25.210938 19.449219 25.414063 19.210938 C 25.617188 18.96875 25.695313 18.648438 25.625 18.34375 C 25.472656 17.695313 25.375 17.007813 25.375 16.3125 C 25.375 11.414063 29.320313 7.46875 34.21875 7.46875 Z"/></svg>'/>,
        },
        {
            label: 'youtube',
            value: 'youtube',
            prefix: <Icon
                source='<svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 24 24" width="24px" height="24px">    <path d="M 12 4 C 12 4 5.7455469 3.9999687 4.1855469 4.4179688 C 3.3245469 4.6479688 2.6479687 5.3255469 2.4179688 6.1855469 C 1.9999687 7.7455469 2 12 2 12 C 2 12 1.9999687 16.254453 2.4179688 17.814453 C 2.6479687 18.675453 3.3255469 19.352031 4.1855469 19.582031 C 5.7455469 20.000031 12 20 12 20 C 12 20 18.254453 20.000031 19.814453 19.582031 C 20.674453 19.352031 21.352031 18.674453 21.582031 17.814453 C 22.000031 16.254453 22 12 22 12 C 22 12 22.000031 7.7455469 21.582031 6.1855469 C 21.352031 5.3255469 20.674453 4.6479688 19.814453 4.4179688 C 18.254453 3.9999687 12 4 12 4 z M 12 6 C 14.882 6 18.490875 6.1336094 19.296875 6.3496094 C 19.465875 6.3946094 19.604391 6.533125 19.650391 6.703125 C 19.891391 7.601125 20 10.342 20 12 C 20 13.658 19.891391 16.397875 19.650391 17.296875 C 19.605391 17.465875 19.466875 17.604391 19.296875 17.650391 C 18.491875 17.866391 14.882 18 12 18 C 9.119 18 5.510125 17.866391 4.703125 17.650391 C 4.534125 17.605391 4.3956094 17.466875 4.3496094 17.296875 C 4.1086094 16.398875 4 13.658 4 12 C 4 10.342 4.1086094 7.6011719 4.3496094 6.7011719 C 4.3946094 6.5331719 4.533125 6.3946094 4.703125 6.3496094 C 5.508125 6.1336094 9.118 6 12 6 z M 10 8.5351562 L 10 15.464844 L 16 12 L 10 8.5351562 z"/></svg>'/>,
        },
    ];

    const prefix = (title) => {
        switch (title) {
            case "facebook" :
                return <Icon
                    source='<svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 24 24" width="24px" height="24px"><path d="M 12 2 C 6.4889971 2 2 6.4889971 2 12 C 2 17.511003 6.4889971 22 12 22 C 17.511003 22 22 17.511003 22 12 C 22 6.4889971 17.511003 2 12 2 z M 12 4 C 16.430123 4 20 7.5698774 20 12 C 20 16.014467 17.065322 19.313017 13.21875 19.898438 L 13.21875 14.384766 L 15.546875 14.384766 L 15.912109 12.019531 L 13.21875 12.019531 L 13.21875 10.726562 C 13.21875 9.7435625 13.538984 8.8710938 14.458984 8.8710938 L 15.935547 8.8710938 L 15.935547 6.8066406 C 15.675547 6.7716406 15.126844 6.6953125 14.089844 6.6953125 C 11.923844 6.6953125 10.654297 7.8393125 10.654297 10.445312 L 10.654297 12.019531 L 8.4277344 12.019531 L 8.4277344 14.384766 L 10.654297 14.384766 L 10.654297 19.878906 C 6.8702905 19.240845 4 15.970237 4 12 C 4 7.5698774 7.5698774 4 12 4 z"/></svg>'/>
            case "instagram" :
                return <Icon
                    source='<svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 24 24" width="24px" height="24px">    <path d="M 8 3 C 5.243 3 3 5.243 3 8 L 3 16 C 3 18.757 5.243 21 8 21 L 16 21 C 18.757 21 21 18.757 21 16 L 21 8 C 21 5.243 18.757 3 16 3 L 8 3 z M 8 5 L 16 5 C 17.654 5 19 6.346 19 8 L 19 16 C 19 17.654 17.654 19 16 19 L 8 19 C 6.346 19 5 17.654 5 16 L 5 8 C 5 6.346 6.346 5 8 5 z M 17 6 A 1 1 0 0 0 16 7 A 1 1 0 0 0 17 8 A 1 1 0 0 0 18 7 A 1 1 0 0 0 17 6 z M 12 7 C 9.243 7 7 9.243 7 12 C 7 14.757 9.243 17 12 17 C 14.757 17 17 14.757 17 12 C 17 9.243 14.757 7 12 7 z M 12 9 C 13.654 9 15 10.346 15 12 C 15 13.654 13.654 15 12 15 C 10.346 15 9 13.654 9 12 C 9 10.346 10.346 9 12 9 z"/></svg>'/>
            case "twitter" :
                return <Icon
                    source='<svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 50 50" width="50px" height="50px"><path d="M 34.21875 5.46875 C 28.238281 5.46875 23.375 10.332031 23.375 16.3125 C 23.375 16.671875 23.464844 17.023438 23.5 17.375 C 16.105469 16.667969 9.566406 13.105469 5.125 7.65625 C 4.917969 7.394531 4.597656 7.253906 4.261719 7.277344 C 3.929688 7.300781 3.632813 7.492188 3.46875 7.78125 C 2.535156 9.386719 2 11.234375 2 13.21875 C 2 15.621094 2.859375 17.820313 4.1875 19.625 C 3.929688 19.511719 3.648438 19.449219 3.40625 19.3125 C 3.097656 19.148438 2.726563 19.15625 2.425781 19.335938 C 2.125 19.515625 1.941406 19.839844 1.9375 20.1875 L 1.9375 20.3125 C 1.9375 23.996094 3.84375 27.195313 6.65625 29.15625 C 6.625 29.152344 6.59375 29.164063 6.5625 29.15625 C 6.21875 29.097656 5.871094 29.21875 5.640625 29.480469 C 5.410156 29.742188 5.335938 30.105469 5.4375 30.4375 C 6.554688 33.910156 9.40625 36.5625 12.9375 37.53125 C 10.125 39.203125 6.863281 40.1875 3.34375 40.1875 C 2.582031 40.1875 1.851563 40.148438 1.125 40.0625 C 0.65625 40 0.207031 40.273438 0.0507813 40.71875 C -0.109375 41.164063 0.0664063 41.660156 0.46875 41.90625 C 4.980469 44.800781 10.335938 46.5 16.09375 46.5 C 25.425781 46.5 32.746094 42.601563 37.65625 37.03125 C 42.566406 31.460938 45.125 24.226563 45.125 17.46875 C 45.125 17.183594 45.101563 16.90625 45.09375 16.625 C 46.925781 15.222656 48.5625 13.578125 49.84375 11.65625 C 50.097656 11.285156 50.070313 10.789063 49.777344 10.445313 C 49.488281 10.101563 49 9.996094 48.59375 10.1875 C 48.078125 10.417969 47.476563 10.441406 46.9375 10.625 C 47.648438 9.675781 48.257813 8.652344 48.625 7.5 C 48.75 7.105469 48.613281 6.671875 48.289063 6.414063 C 47.964844 6.160156 47.511719 6.128906 47.15625 6.34375 C 45.449219 7.355469 43.558594 8.066406 41.5625 8.5 C 39.625 6.6875 37.074219 5.46875 34.21875 5.46875 Z M 34.21875 7.46875 C 36.769531 7.46875 39.074219 8.558594 40.6875 10.28125 C 40.929688 10.53125 41.285156 10.636719 41.625 10.5625 C 42.929688 10.304688 44.167969 9.925781 45.375 9.4375 C 44.679688 10.375 43.820313 11.175781 42.8125 11.78125 C 42.355469 12.003906 42.140625 12.53125 42.308594 13.011719 C 42.472656 13.488281 42.972656 13.765625 43.46875 13.65625 C 44.46875 13.535156 45.359375 13.128906 46.3125 12.875 C 45.457031 13.800781 44.519531 14.636719 43.5 15.375 C 43.222656 15.578125 43.070313 15.90625 43.09375 16.25 C 43.109375 16.65625 43.125 17.058594 43.125 17.46875 C 43.125 23.71875 40.726563 30.503906 36.15625 35.6875 C 31.585938 40.871094 24.875 44.5 16.09375 44.5 C 12.105469 44.5 8.339844 43.617188 4.9375 42.0625 C 9.15625 41.738281 13.046875 40.246094 16.1875 37.78125 C 16.515625 37.519531 16.644531 37.082031 16.511719 36.683594 C 16.378906 36.285156 16.011719 36.011719 15.59375 36 C 12.296875 35.941406 9.535156 34.023438 8.0625 31.3125 C 8.117188 31.3125 8.164063 31.3125 8.21875 31.3125 C 9.207031 31.3125 10.183594 31.1875 11.09375 30.9375 C 11.53125 30.808594 11.832031 30.402344 11.816406 29.945313 C 11.800781 29.488281 11.476563 29.097656 11.03125 29 C 7.472656 28.28125 4.804688 25.382813 4.1875 21.78125 C 5.195313 22.128906 6.226563 22.402344 7.34375 22.4375 C 7.800781 22.464844 8.214844 22.179688 8.355469 21.746094 C 8.496094 21.3125 8.324219 20.835938 7.9375 20.59375 C 5.5625 19.003906 4 16.296875 4 13.21875 C 4 12.078125 4.296875 11.03125 4.6875 10.03125 C 9.6875 15.519531 16.6875 19.164063 24.59375 19.5625 C 24.90625 19.578125 25.210938 19.449219 25.414063 19.210938 C 25.617188 18.96875 25.695313 18.648438 25.625 18.34375 C 25.472656 17.695313 25.375 17.007813 25.375 16.3125 C 25.375 11.414063 29.320313 7.46875 34.21875 7.46875 Z"/></svg>'/>
            case "youtube" :
                return <Icon
                    source='<svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 24 24" width="24px" height="24px">    <path d="M 12 4 C 12 4 5.7455469 3.9999687 4.1855469 4.4179688 C 3.3245469 4.6479688 2.6479687 5.3255469 2.4179688 6.1855469 C 1.9999687 7.7455469 2 12 2 12 C 2 12 1.9999687 16.254453 2.4179688 17.814453 C 2.6479687 18.675453 3.3255469 19.352031 4.1855469 19.582031 C 5.7455469 20.000031 12 20 12 20 C 12 20 18.254453 20.000031 19.814453 19.582031 C 20.674453 19.352031 21.352031 18.674453 21.582031 17.814453 C 22.000031 16.254453 22 12 22 12 C 22 12 22.000031 7.7455469 21.582031 6.1855469 C 21.352031 5.3255469 20.674453 4.6479688 19.814453 4.4179688 C 18.254453 3.9999687 12 4 12 4 z M 12 6 C 14.882 6 18.490875 6.1336094 19.296875 6.3496094 C 19.465875 6.3946094 19.604391 6.533125 19.650391 6.703125 C 19.891391 7.601125 20 10.342 20 12 C 20 13.658 19.891391 16.397875 19.650391 17.296875 C 19.605391 17.465875 19.466875 17.604391 19.296875 17.650391 C 18.491875 17.866391 14.882 18 12 18 C 9.119 18 5.510125 17.866391 4.703125 17.650391 C 4.534125 17.605391 4.3956094 17.466875 4.3496094 17.296875 C 4.1086094 16.398875 4 13.658 4 12 C 4 10.342 4.1086094 7.6011719 4.3496094 6.7011719 C 4.3946094 6.5331719 4.533125 6.3946094 4.703125 6.3496094 C 5.508125 6.1336094 9.118 6 12 6 z M 10 8.5351562 L 10 15.464844 L 16 12 L 10 8.5351562 z"/></svg>'/>

        }
    }


    const positionOptions = [
        {label: 'Top Left', value: 'Top Left'},
        {label: 'Top Right', value: 'Top Right'},
        {label: 'Bottom Left', value: 'Bottom Left'},
        {label: 'Bottom Right', value: 'Bottom Right'},
    ];

    const handlePositionChange = () => {
        setShowSelectOption(false);
    }

    const onUpdate = useCallback( async (body) => {
            setIsLoading(true);
            await (async () => {
                const url = `/api/media_icons/shops/${shop.uuid}`;
                const method = "PATCH";
                const response = await fetch(url, {
                    method,
                    body: JSON.stringify(body),
                    headers: {
                        "Content-Type": "application/json"
                    }
                });
                if (response.ok) {
                    const response = await fetch("/api/media_icons/shops", {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json"
                        }
                    });
                    if (response.ok) {
                        const data = await response.json();
                        setShop(data[0]);
                    }
                }
            })();

                if (JSON.stringify(socialMediaIconList) !== JSON.stringify(updatedMediaIconList)) {
                    console.log(socialMediaIconList)
                    console.log("????????????????????????????????????????????????????????")
                    console.log(updatedMediaIconList)
                    if (socialMediaIconList.length === updatedMediaIconList.length) {
                        for (let i = 0; i <= socialMediaIconList.length; i++) {
                            if (JSON.stringify(socialMediaIconList[i]) !== JSON.stringify(updatedMediaIconList[i])) {
                                const url = `/api/media_icons/links/${socialMediaIconList[i].id}`;
                                const method = "PATCH";
                                const response = await fetch(url, {
                                    method,
                                    body: JSON.stringify({
                                        "iconLink": socialMediaIconList[i].link,
                                        "color": socialMediaIconList[i].color
                                    }),
                                    headers: {
                                        "Content-Type": "application/json"
                                    }
                                });
                                if (response.ok) {
                                    const url = `/api/media_icons/links`;
                                    const method = "GET";
                                    const response = await fetch(url, {
                                        method,
                                        headers: {
                                            "Content-Type": "application/json"
                                        },
                                    });
                                    if (response.ok) {
                                        const data = await response.json();
                                        setSocialMediaIconList(data)
                                        setUpdatedMediaIconList(data)
                                    }
                                }
                            }
                        }
                    }
                } else {
                    console.log(socialMediaIconList)
                    console.log("=======================================================")
                    console.log(updatedMediaIconList)
                }
            setShowSelectOption(true);
            setIsLoading(false);
        }
    , [shop, setShop]);

    let {
        fields: {
            position,
            shape,
            status,
        },
        submit: update,
    } = useForm({
        fields: {
            position: useField(shop?.position||''),
            shape: useField(shop?.shape||''),
            status: useField(shop?.appStatus||''),
        },
        onSubmit: onUpdate,
    });

    let {
        fields: {
            title,
            iconLink,
            icon,
            color,
        },
        reset,
        submit,
        makeClean,
    } = useForm({
        fields: {
            title: useField({
                value: mediaIcon?.title || "",
                validates: [notEmptyString("Please enter platform name")],
            }),
            iconLink: useField({
                value: mediaIcon?.iconLink || "",
                validates: [notEmptyString("Please enter platform url")],
            }),
            icon: useField({
                value: mediaIcon?.icon || ""
            }),
            color: useField({
                value: mediaIcon?.color || ""
            }),
        },
        onSubmit,
    });

    const handleSelectChange = (value) => {
        position.onChange(value);
    }
    const handleSelectTitleChange = useCallback((value) => {
        title.onChange(value)
    }, []);

    const handleColor = useCallback((e) => {
        color.onChange(e.target.value)
    }, []);

    const handleColorAndUrlChange = (id, field, value) => {
        const newArray = socialMediaIconList.map(item => {
            if (item.id === id) {
                return { ...item, [field]: value };
            }
            return item;
        });
        setSocialMediaIconList(newArray);
    }


    const handleFileChange = useCallback( (e) => {
        icon.onChange(URL.createObjectURL(e.target.files[0]));
    }, []);

    const handleShapeChange = (e) => {
        shape.onChange(e.target.id)
    }

    function handleChange() {
        if (status.value === "App enabled") {
            status.onChange("App disabled")
        } else {
            status.onChange("App enabled")
        }
    }

    const handleDeleteBtnClick = useCallback(
        async (e) => {
            setIsLoading(true);
            const id = e.target.id
            reset();
            const response = await fetch(`/api/media_icons/links/${id}`, {
                method: "DELETE",
                headers: {"Content-Type": "application/json"},
            });
            if (response.ok) {
                const url = `/api/media_icons/links`;
                const method = "GET";
                const response = await fetch(url, {
                    method,
                    headers: {
                        "Content-Type": "application/json"
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    setSocialMediaIconList(data)
                    setUpdatedMediaIconList(data)
                    setIsLoading(false);
                }
            }
        }, [socialMediaIconList]);

    const handleDrop = useCallback ( (droppedItem) => {
        (async () => {
            setIsLoading(true);
            const CurrentPosition = droppedItem.source.index + 1;
            const TargetPosition = droppedItem.destination.index + 1;
            if (!droppedItem.destination) return;
            const url = `/api/media_icons/links/order?currentPosition=${CurrentPosition}&targetPosition=${TargetPosition}`;
            const method = "GET";
            const response = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json"
                },
            });
            if (response.ok) {
                const data = await response.json();
                setSocialMediaIconList(data)
                setUpdatedMediaIconList(data)
            }
            setIsLoading(false);
        })()
    }, [socialMediaIconList]);

    return(
        <Layout>
            <Form onSubmit={null}>
            <Layout.Section>
                <TitleBar title="Social Media Icon App"
                                          primaryAction={{
                                              content: "Save",
                                              onAction: update,
                                              disabled: !showTitleBar,
                                          }}
                                          secondaryActions={[
                                              {
                                                  content: "Reset",
                                                  onAction: null,
                                              },
                                          ]}
                />
                <div style={{ height: "100px" }}>
                    <Frame>{isLoading ? <Loading /> : null}</Frame>
                </div>
            </Layout.Section>
            </Form>
            <Layout.Section>
                <Heading>Social bar - social media icons</Heading>
            </Layout.Section>

            <Layout.Section>
                <Banner title="About the app" status="info" >
                    <p>This app adds social media icons of your choice.</p>
                </Banner>
            </Layout.Section>

            <Layout.Section oneThird>
                <Card sectioned title="General Setting"
                      actions={[{
                          onAction() {},
                      }]}
                >
                    <Card sectioned>
                        <h2>{status.value}</h2>
                        <label className="switch">
                            <input type="checkbox" checked={status.value === "App enabled"} onChange={handleChange}/>
                            <span className="slider1 round"></span>
                        </label>
                    </Card>
                    <Card sectioned>
                        <Stack
                            wrap={false}
                            spacing="extraTight"
                            distribution="trailing"
                            alignment="center"
                        >
                            <Stack.Item fill>
                                <Heading>Bar's Positioning</Heading>
                            </Stack.Item>
                        </Stack>
                        {showSelectOption ? (
                            <TextField
                                value={position.value}
                                onFocus={handlePositionChange}
                                autoComplete="off"
                                label=""
                                labelHidden
                            />
                        ) : (
                            <Select
                                label=""
                                labelInline
                                options={positionOptions}
                                onChange={handleSelectChange}
                                value={position.value}
                            />
                        )}
                    </Card>
                    <Card title={"Bar Icon's Shape"}>
                        <div className="b1">
                            <div className="a1">
                                <input
                                    type="checkbox"
                                    checked={shape.value === "circle"}
                                    onChange={handleShapeChange}
                                    id={"circle"}
                                />
                            </div>
                            <div id={"circle"} className={shape.value === "circle" ? "circleShape": "circle" } onClick={handleShapeChange}/>
                            <div style={{marginLeft: "40px", display: "inline-block"}}>
                                <div className="a1">
                                    <input
                                        type="checkbox"
                                        checked={shape.value === "rectangle"}
                                        onChange={handleShapeChange}
                                        id={"rectangle"}
                                    />
                                </div>
                                <div id={"rectangle"} className={shape.value === "rectangle" ? "rectangleShape" : "rectangle"} onClick={handleShapeChange}/>
                            </div>
                        </div>
                    </Card>

                </Card>
            </Layout.Section>

            <Layout.Section oneThird>
                <Card sectioned title="Social media setting"
                      actions={[{
                          content: 'Add Social Media icon',
                          onAction() {
                              onAddBtnClick();
                          },
                      }]}
                >
                    <p>The icon in your store will appear in this order. Drag <b>(&#10133;)</b> and arrange them as you like.</p>

                    {
                        showForm ? (
                            <Card sectioned>
                                <Card>
                                    <Form onSubmit={null}>
                                        <FormLayout>
                                            <Select
                                                label=""
                                                labelInline
                                                options={titleOptions}
                                                onChange={handleSelectTitleChange}
                                                value={title.value}
                                            />
                                            <TextField
                                                {...iconLink}
                                                placeholder={"Url"}
                                                autoComplete="off"
                                            />

                                            <input type="file"  onChange={handleFileChange} />
                                            {/*<img src={`data:image/svg+xml;utf8,${icon.value}`}/>*/}

                                            <div className="selectColorText">Icon's colour {" "}
                                                <div className="selectColor">
                                                    <input style={{width:"30px"}} type="color" name="favColor" value={color.value} onChange={handleColor} />
                                                </div>

                                            </div>
                                            <ButtonGroup>
                                                <Button onClick={cancelBtnClick}>Cancel</Button>
                                                <Button primary onClick={submit}>Submit</Button>
                                            </ButtonGroup>
                                        </FormLayout>
                                    </Form>
                                </Card>
                            </Card>
                        ) : null
                    }
                    <DragDropContext onDragEnd={handleDrop}>
                        <Droppable droppableId="list-container">
                            {(provided) => (
                                <div
                                    className="list-container a"
                                    {...provided.droppableProps}
                                    ref={provided.innerRef}
                                >
                                    {socialMediaIconList.map((data, index) => (
                                        <Draggable key={data.title} draggableId={data.title} index={index}>
                                            {(provided) => (
                                                <div
                                                    className="item-container"
                                                    ref={provided.innerRef}
                                                    {...provided.dragHandleProps}
                                                    {...provided.draggableProps}
                                                >

                                                    <div id="d">
                                                        <Stack
                                                            wrap={false}
                                                            spacing="extraTight"
                                                            distribution="trailing"
                                                            alignment="center"
                                                        >
                                                            <Stack.Item fill>
                                                                <Heading>{data.title}</Heading>
                                                            </Stack.Item>

                                                            <Stack.Item>
                                                                <Button plain onClick={handleDeleteBtnClick}>
                                                                    <span id={data.id}>Delete</span>
                                                                    {/*<Icon source={DeleteMinor}/>*/}
                                                                </Button>
                                                            </Stack.Item>
                                                        </Stack>
                                                            <TextField
                                                                value={data.link}
                                                                placeholder={data.link}
                                                                prefix={prefix(data.title)}
                                                                autoComplete="off"
                                                                label="url"
                                                                labelHidden
                                                                onChange={value => handleColorAndUrlChange(data.id, "link", value)}
                                                            />
                                                        <div className="selectColorText">Icon's colour </div>
                                                        <div className="selectColor">
                                                            <input
                                                                style={{width:"30px"}}
                                                                type="color"
                                                                id={data.id}
                                                                name="favColor"
                                                                value={data.color}
                                                                onChange={e => handleColorAndUrlChange(data.id, "color", e.target.value)}
                                                            />
                                                        </div>
                                                    </div>

                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </DragDropContext>
                </Card>
            </Layout.Section>
        </Layout>
    );
}