import Link from 'next/link'
import { useRouter } from "next/router";

const Navigation = ({ pathname, services, state }) => {
    return (
        <>
            <li className={"nav-item-x" + (pathname == "/" ? " active" : "")}>
                <Link href={'/'}>
                    <a className="nav-link">Home</a>
                </Link>
            </li>
            <li className="has-children">
                <Link href={'/removal-services'}>
                    <a className="nav-link">Our Services</a>
                </Link>
                <ul className="dropdown arrow-top">
                    {(() => {
                        if (services.length > 0) {
                            return (
                                services.map((svc, svcInd) => {
                                    if (svc.display_type === 'both' || svc.display_type === 'page') {
                                        // hassubs
                                        const hasSubsClass = ((svc.categories).length > 0 && svc.has_submenu === true) ? 'has-children' : ''
                                        return (
                                            <li className={hasSubsClass} key={svcInd}>
                                                <Link href={`/${svc.slug}`}>
                                                    <a className="nav-link">{svc.title}</a>
                                                </Link>
                                                {(() => {
                                                    if ((svc.categories).length > 0) {
                                                        const categoryList = svc.categories
                                                        return (
                                                            <ul className="dropdown">
                                                                {
                                                                    categoryList.map((cat, catInd) => {
                                                                        if (cat.display_type === 'both' || cat.display_type === 'page') {
                                                                            return (
                                                                                <li key={catInd}>
                                                                                    <Link href={`/${svc.slug}/${cat.slug}`}>
                                                                                        <a>{cat.title}</a>
                                                                                    </Link>
                                                                                </li>
                                                                            )
                                                                        }
                                                                    })
                                                                }
                                                            </ul>
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
                    <a className="nav-link">Contact Us</a>
                </Link>
            </li>
            <li className={" " + (pathname == "/blogs" ? " active" : "")}>
                <Link href={'/blogs?page=1'}>
                    <a className="nav-link">Blogs</a>
                </Link>
            </li>
            <li className={" " + (pathname == "/storage-london" ? " active" : "")}>
                <Link href={'/storage-london'}>
                    <a className="nav-link">Storage</a>
                </Link>
            </li>
            <li className={" " + (pathname == "/packing-material" ? " active" : "")}>
                <Link href={'/packing-material'}>
                    <a className="nav-link">Packing Materials</a>
                </Link>
            </li>
            <li className={" " + (pathname.includes('/user') || pathname.includes('/auth') ? " active" : "")}>
                <Link href={state.userDashboard.url}>
                    <a className="nav-link"> {state.userDashboard.text} </a>
                </Link>
            </li>
            <li className={" " + (pathname == "/packings/cart" ? " active" : "")}>
                <Link href={'/packings/cart'}>
                    <a className="nav-link">Cart</a>
                </Link>
            </li>
        </>
    );
};

export default Navigation;
