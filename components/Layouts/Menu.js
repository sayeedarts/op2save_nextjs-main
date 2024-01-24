import Link from 'next/link'

const Menu = ({ pathname, services, state }) => {
    return (
        <>
            <nav id="menu">
                <input type="checkbox" id="tm" />
                <ul className="main-menu cf">
                    <li className={(pathname == "/" ? " active" : "")}>
                        <Link href={'/'}>
                            <a>Home</a>
                        </Link>
                    </li>
                    <li>
                        <Link href='/removal-services'>
                            <a> Services
                                <span className="drop-icon"> <i className='fa fa-arrow-circle-down mx-1'></i> </span>
                            </a>
                        </Link>
                        <label title="Toggle Drop-down" className="drop-icon" htmlFor="services"> <i className='fa fa-chevron-down'></i> </label>

                        <input type="checkbox" id="services" />
                        <ul className="sub-menu">
                            {(() => {
                                if (services.length > 0) {
                                    return (
                                        services.map((svc, svcInd) => {
                                            if (svc.display_type === 'both' || svc.display_type === 'page') {
                                                return (
                                                    <li key={svcInd}>
                                                        <Link href={`/${svc.slug}`}>
                                                            <a>
                                                                {svc.title}
                                                                {svc.has_submenu ?
                                                                    <span className="drop-icon"> <i className='fa fa-arrow-circle-right mx-1'></i> </span>
                                                                    : ''
                                                                }
                                                            </a>
                                                        </Link>
                                                        {svc.has_submenu ?
                                                            <>
                                                                <label title="Toggle Drop-down" className="drop-icon" htmlFor={'sm' + svcInd}><i className='fa fa-chevron-down'></i></label>
                                                            </>
                                                            : ''
                                                        }
                                                        {/* Conditional */}
                                                        {(() => {
                                                            if (svc.has_submenu) {
                                                                const categoryList = svc.categories
                                                                return (
                                                                    <>
                                                                        <input type="checkbox" id={'sm' + svcInd} />
                                                                        <ul className="sub-menu">
                                                                            {
                                                                                categoryList.map((cat, catInd) => {
                                                                                    if (cat.display_type === 'both' || cat.display_type === 'page') {
                                                                                        return (
                                                                                            <li className='deepmenu' key={catInd}>
                                                                                                <Link href={`/${svc.slug}/${cat.slug}`}>
                                                                                                    <a>{cat.title}</a>
                                                                                                </Link>
                                                                                            </li>
                                                                                        )
                                                                                    }
                                                                                })
                                                                            }
                                                                        </ul>
                                                                    </>
                                                                )
                                                            }
                                                        })()}

                                                    </li>
                                                )
                                            }

                                        })
                                    )
                                }
                            })()}
                        </ul>
                    </li>
                    <li className={" " + (pathname == "/contact-us" ? " active" : "")}>
                        <Link href={'/contact-us'}>
                            <a className="nav-link-x">Contact Us</a>
                        </Link>
                    </li>
                    <li className={" " + (pathname == "/blogs" ? " active" : "")}>
                        <Link href={'/blogs?page=1'}>
                            <a className="nav-link-x">Blogs</a>
                        </Link>
                    </li>
                    <li className={" " + (pathname == "/storage-london" ? " active" : "")}>
                        <Link href={'/storage-london'}>
                            <a className="nav-link-x">Storage</a>
                        </Link>
                    </li>
                    <li className={" " + (pathname == "/packing-material" ? " active" : "")}>
                        <Link href={'/packing-material'}>
                            <a className="nav-link-x">Packing Materials</a>
                        </Link>
                    </li>
                    <li className={" " + (pathname.includes('/user') || pathname.includes('/auth') ? " active" : "")}>
                        <Link href={state.userDashboard.url}>
                            <a className="nav-link-x"> {state.userDashboard.text} </a>
                        </Link>
                    </li>
                    <li className={" " + (pathname == "/packing-material/cart" ? " active" : "")}>
                        <Link href={'/packing-material/cart'}>
                            <a className="nav-link-x">Cart</a>
                        </Link>
                    </li>
                </ul>
            </nav>
        </>
    )
}

export default Menu