export const cssSetting = {
    cssTopNag: '-translate-y-6',
    cssTopNagDes: '-translate-y-5',
    cssFontSky: 'text-sky-600',
}

export const hdlClickInput = (e) => {
    e.preventDefault();

    const { name, tagName } = e.target;
    const el = document.getElementsByName(name);

    el[1].focus();
    el[0].classList.add(tagName === 'TEXTAREA' ? cssSetting.cssTopNagDes : cssSetting.cssTopNag, cssSetting.cssFontSky);
    return;
}

export const hdlInputOnBlur = (e) => {
    e.preventDefault();

    const { name, value, tagName } = e.target;
    const el = document.getElementsByName(name);

    if (!value) {
        el[0].classList.remove(tagName === 'TEXTAREA' ? cssSetting.cssTopNagDes : cssSetting.cssTopNag, cssSetting.cssFontSky);
    } else {
        el[0].classList.remove(cssSetting.cssFontSky);
    }
    return;
};
