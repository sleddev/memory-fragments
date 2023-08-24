import {Route, Routes, useNavigate } from "@solidjs/router";
import { Component } from "solid-js";
import {useMF} from "../../contexts/MFContext";

export const DashSidebar: Component<{}> = (props) => {
    const navigate = useNavigate()
    if (!useMF().apiKey()) navigate('/auth/login')

    return (
        <h1></h1>
    );
};