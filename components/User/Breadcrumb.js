import React from 'react'

const Breadcrumb = ({ activeMenu, title }) => {
    let menuName = activeMenu;
    const pageTitle = makeTitle(menuName)
    function makeTitle(slug) {
        var words = slug.split('-');
        for (var i = 0; i < words.length; i++) {
            var word = words[i];
            words[i] = word.charAt(0).toUpperCase() + word.slice(1);
        }
        return words.join(' ');
    }
    return (
        <>
            <nav aria-label="breadcrumb" className="main-breadcrumb">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item"><a href="#">Home</a></li>
                    <li className="breadcrumb-item"><a href="javascript:void(0)">User</a></li>
                    <li className="breadcrumb-item active" aria-current="page">{title}</li>
                </ol>
            </nav>
        </>
    )
}

export default Breadcrumb
