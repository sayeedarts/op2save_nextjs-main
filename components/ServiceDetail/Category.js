import React, { useState, useEffect, Fragment } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { uuid } from '../../services/helper'
import axios from '../../services/axios'
import { useSelector, useDispatch } from 'react-redux'
import { selectedService, getSelectedItems, itemCountToggle } from '../../redux/homeSlice'
// dispatch(getSelectedItems(slug))

const Category = (props) => {
    const formik = props.formik
    const { slug } = props
    const dispatch = useDispatch();
    const store_selected_items = useSelector((state) => state.homeSlice.selected_items);

    const [itemCounts, setItemCounts] = useState([]);

    const [selectedItems, setSelectedItems] = useState([]);
    const [activeTab, setActiveTab] = useState("");
    const [any, setAny] = useState("");

    const category_list = props.serviceDetails.category;

    useEffect(() => {
        console.log("Use Effect called");
        getServiceItems()
        getServiceCategories()
        return () => {

        }
    }, [itemCounts])

    const [searchItems, setSearchItems] = useState({})
    const [items, setItems] = useState({})
    const [autocomplete, setAutocomplete] = useState({
        show: false
    })
    const handleClickClose = () => {
        if (autocomplete.show === true) setSearchItemSelected("")
        setAutocomplete({
            show: !autocomplete.show
        })
    }

    const [searchItemSelected, setSearchItemSelected] = useState("")
    const getServiceItems = async () => {
        // service/items
        const callApi = await axios.get(`service/items`);
        const getResponse = await callApi.data;
        if (getResponse.status == 1) {
            setItems(getResponse.data)
            setSearchItems(getResponse.data)
        }
    }
    const handleOnchangeItemSearch = (e) => {
        let search = e.target.value
        setSearchItemSelected(search)
        let filtered = {};
        for (const key in searchItems) {
            const searchTerm = searchItems[key].toLowerCase()
            if (searchTerm.includes(search.toLowerCase())) {
                filtered[key] = searchItems[key]
            }
        }
        setItems(filtered)
        setAutocomplete({
            show: true
        })
    }
    const [categories, setCategories] = useState([])
    const getServiceCategories = async () => {
        const callApi = await axios.get(`service/${slug}/info`);
        const getResponse = await callApi.data;
        if (getResponse.status == 1) {
            const firstObject = parseInt(Object.keys(getResponse.data)[0]);
            // By default select first Object as active tab
            setActiveTab(firstObject)
            setCategories(getResponse.data)
        }
    }
    const handleItemCheck = (event, selected_id, alt = false) => {
        var checked = alt === true ? true : event.target.checked;
        if (checked) {
            const a = [...selectedItems, { id: selected_id, count: 1 }];
            setSelectedItems(a);
        } else {
            const objIndex = selectedItems.findIndex((obj => obj.id == selected_id))
            selectedItems.splice(objIndex, 1)
            setSelectedItems(selectedItems)
        }

        dispatch(getSelectedItems({ id: selected_id, is_checked: checked }));
    }

    const handleItemPlusMinus = (type, selected_id) => {
        dispatch(itemCountToggle({ id: selected_id, mode: type }))
        // Find the array's key by the selected ID
        const objIndex = selectedItems.findIndex((obj => obj.id == selected_id))
        // Update specific key's object's key's value
        if (type == "plus") {
            selectedItems[objIndex]['count'] = (selectedItems[objIndex].count + 1)
        } else if (type == "minus") {
            if (selectedItems[objIndex].count > 1) {
                selectedItems[objIndex]['count'] = (selectedItems[objIndex].count - 1)
            }
        }
        // Finally update to the State
        setSelectedItems(selectedItems);
        setAny(uuid());
    }

    const itemCount = (selected_id) => {
        if ((selectedItems) && selectedItems.length > 0) {
            const objIndex = selectedItems.findIndex((obj => obj.id == selected_id))
            const optedOne = selectedItems[objIndex];
            if (typeof optedOne !== 'undefined') {
                return optedOne.count;
            }
        }
        return 0
    }

    // Clicking on the
    const handleListClick = (id) => {
        setActiveTab(id);
    }

    const clickingAdditionalItem = (id, name) => {
        let getCategories = { ...categories }
        let selectedId = parseInt(id)
        let selectedItems = getCategories[activeTab].items

        const found = selectedItems.some(el => el.id === selectedId);
        if (!found) {
            // If new Item comes
            selectedItems.push({ id: selectedId, name: name })
            getCategories[activeTab].items = [...selectedItems]
            setCategories(getCategories)
        } else {
            // If item is already Exists!
            // handleItemCheck('', selectedId, true)
        }
    }


    return (
        <div>
            <p className="left_title"><small>Categories</small></p>
            <div className="tab_section yelloo_box mt-5">
                <div className="row">
                    {/* LEFT PANEL OF THE CHECKBOX LISTING */}
                    {
                        (() => {
                            if (Object.keys(categories).length > 0) {
                                return (
                                    <div className="col-lg-5">
                                        <ul className="nav flex-column nav-tabs" id="myTab">
                                            {(() => {
                                                return (
                                                    Object.keys(categories).map((c, key) => {
                                                        const thisCategory = categories[c]
                                                        const tab_id = `${thisCategory.id}`
                                                        // Check if Category has Any Items or not
                                                        if (thisCategory.items !== '' && typeof thisCategory.items !== 'undefined') {
                                                            return (
                                                                <li className="nav-item" onClick={() => handleListClick(thisCategory.id)} key={key}>
                                                                    <a className={"nav-link " + (((!activeTab && key == 0) || (activeTab == thisCategory.id)) ? "active" : "")} id={"tab_" + tab_id} data-toggle="tab" href={"#tab_" + tab_id} role="tab" aria-controls={"tab_" + tab_id} aria-selected="true">
                                                                        <Image src={thisCategory.icon_url} height={30} width={30} layout='fixed' />
                                                                        <span className="item_name"> {thisCategory.name} </span>
                                                                        <span className="arrow-left"> </span>
                                                                    </a>
                                                                </li>
                                                            )
                                                        }
                                                    })
                                                )
                                            })()}
                                        </ul>
                                    </div>
                                )
                            }
                        })()
                    }

                    {/* RIGHT PANEL OF THE CHECKBOX LISTING */}

                    {/* Tab Section Starts */}
                    {(() => {
                        // category_list > Removed
                        // Check if Any Category is present or not
                        if (Object.keys(categories).length > 0) {
                            return (
                                <div className="col-lg-7 pl-0">
                                    <div className="tab-content" id="myTabContent">

                                        {/* Here all Items with Checkbox will appear */}
                                        {(() => {
                                            return (
                                                Object.keys(categories).map((c, index) => {
                                                    const thisCategory = categories[c]
                                                    const tab_id = `${thisCategory.id}`
                                                    return (
                                                        <div key={index} className={"tab-pane fade ml-3 " + (((!activeTab && index == 0) || (activeTab == thisCategory.id)) ? "show active" : "")} id={"tab_" + tab_id} role="tabpanel" aria-labelledby="home-tab">
                                                            <p className="sub_title"> {thisCategory.name} </p>
                                                            {(() => {
                                                                // Check if Category has Any Items or not
                                                                if (thisCategory.items !== '' && typeof thisCategory.items !== 'undefined') {
                                                                    return (
                                                                        thisCategory.items.map((item, j) => {
                                                                            const objIndex = selectedItems.findIndex((obj => obj.id == item.id))
                                                                            const count = selectedItems[objIndex] ? selectedItems[objIndex].count : 0;
                                                                            return (
                                                                                <div className="table_view" key={j}>
                                                                                    <div className="list_item d-flex">
                                                                                        <div className="item_name">
                                                                                            <span className="count">
                                                                                                {itemCount(item.id) > 0 ? "(" + itemCount(item.id) + "x)" : ""}
                                                                                            </span>
                                                                                            <span className="furniture_name">
                                                                                                {/* {item.id} |  */}
                                                                                                {item.name}
                                                                                            </span>
                                                                                        </div>
                                                                                        {/* + - Toggle */}
                                                                                        <div className="unit_section">
                                                                                            {/* Minus */}
                                                                                            <div className={"item_sub " + (count == 0 ? "d-none" : "")} onClick={() => handleItemPlusMinus('minus', item.id)}>
                                                                                                <span>
                                                                                                    <span className="link">
                                                                                                        <i className="fa fa-minus plus_minus text-danger"></i>
                                                                                                    </span>
                                                                                                </span>
                                                                                            </div>
                                                                                            {/* Plus */}
                                                                                            <div className={"item_add " + (count == 0 ? "d-none" : "")} onClick={() => handleItemPlusMinus('plus', item.id)}>
                                                                                                <span>
                                                                                                    <span className="link">
                                                                                                        <i className="fa fa-plus plus_minus text-primary"></i>
                                                                                                    </span>
                                                                                                </span>
                                                                                            </div>
                                                                                            <div className="item_check">
                                                                                                <input type="checkbox" name="category_id"
                                                                                                    id="category_id"
                                                                                                    onChange={(e) => handleItemCheck(e, item.id)}
                                                                                                    value={item.id}
                                                                                                />
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            )
                                                                        })
                                                                    )
                                                                }
                                                            })()}
                                                        </div>
                                                    )
                                                })
                                            )
                                        })()}

                                        {/* Option for select more item & Enter Additional Items */}
                                        <div className="more_input_box mt-3 ml-3">
                                            <div className="form-group">
                                                <span className="deleteicon">
                                                    <input type="text" className="form-control deletable" name="moving_from"
                                                        placeholder="Start typing.."
                                                        autoComplete="off"
                                                        value={searchItemSelected}
                                                        onChange={handleOnchangeItemSearch}
                                                        // onClick={handleClickClose}
                                                    />
                                                    <span>
                                                        <i
                                                            className={'fa fa-' + (autocomplete.show === true ? "times text-danger" : "chevron-down text-dark")}
                                                            onClick={handleClickClose}
                                                        ></i>
                                                    </span>
                                                </span>
                                                {items && Object.keys(items).length > 0 && autocomplete.show === true ?
                                                    <div className='scrollable_search'>
                                                        {(() => {
                                                            if (Object.keys(items).length > 0) {
                                                                return (
                                                                    Object.keys(items).map((one, key) => {
                                                                        return (
                                                                            <div className='item' key={key} onClick={() => clickingAdditionalItem(one, items[one])}>
                                                                                {items[one]}
                                                                                <i className='fa fa-plus'><strong translate=""> add</strong></i>
                                                                            </div>
                                                                        )
                                                                    })
                                                                )
                                                            }
                                                        })()}
                                                    </div>
                                                    : ""}
                                            </div>
                                            <div className="form-group"></div>
                                            <textarea
                                                className="form-control" id="category_addl_items" rows="3" name="category_addl_items"
                                                value={formik.values.category_addl_items} onChange={formik.handleChange} onBlur={formik.handleBlur}
                                                placeholder="Enter Any Additional Items"
                                            ></textarea>
                                        </div>
                                    </div>
                                </div>
                            )
                        } else {
                            return (
                                <div className="col-lg-7 pl-0">
                                    <p className='ml-3 pl-3 pt-3'>
                                        No Category available. 
                                        <Link href={'/removal-services'}>
                                            <a className='link'> Please choose another Service</a>
                                        </Link>
                                        
                                    </p>
                                </div>
                            )
                        }
                    })()}
                    {/* End of Tab Section */}
                </div>
            </div>
        </div>
    )
}

export default Category
