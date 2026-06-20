import { H as Hls } from "./hls-dru42stk.js";

function initHlsPlayer(panel) {
    const video = panel.querySelector("video[data-hls]");
    const button = panel.querySelector("[data-player-button]");
    const status = panel.querySelector("[data-player-status]");

    if (!video) {
        return;
    }

    const source = video.dataset.hls;

    function setStatus(message) {
        if (status) {
            status.textContent = message;
        }
    }

    function bindPlayButton() {
        if (!button) {
            return;
        }
        button.addEventListener("click", function () {
            video.play().catch(function () {
                setStatus("浏览器阻止了自动播放，请再次点击视频控件播放。");
            });
        });
        video.addEventListener("play", function () {
            panel.classList.add("is-playing");
        });
        video.addEventListener("pause", function () {
            panel.classList.remove("is-playing");
        });
    }

    if (!source) {
        setStatus("未找到可用的 HLS 播放源。");
        bindPlayButton();
        return;
    }

    if (Hls.isSupported()) {
        const hls = new Hls({
            enableWorker: true,
            lowLatencyMode: true,
            backBufferLength: 90
        });

        hls.loadSource(source);
        hls.attachMedia(video);

        hls.on(Hls.Events.MANIFEST_PARSED, function () {
            setStatus("HLS 播放源已就绪，点击播放按钮即可观看。");
        });

        hls.on(Hls.Events.ERROR, function (event, data) {
            if (!data || !data.fatal) {
                return;
            }

            if (data.type === Hls.ErrorTypes.NETWORK_ERROR) {
                setStatus("网络波动，正在重新加载播放源。");
                hls.startLoad();
                return;
            }

            if (data.type === Hls.ErrorTypes.MEDIA_ERROR) {
                setStatus("媒体解码异常，正在尝试恢复播放。");
                hls.recoverMediaError();
                return;
            }

            setStatus("播放源暂时无法加载，请刷新页面重试。");
            hls.destroy();
        });
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = source;
        setStatus("浏览器原生支持 HLS，点击播放按钮即可观看。");
    } else {
        setStatus("当前浏览器不支持 HLS 播放，请更换现代浏览器访问。");
    }

    bindPlayButton();
}

document.querySelectorAll("[data-player]").forEach(initHlsPlayer);
