import React, { useRef, useEffect, useState, useCallback } from "react";
import { useSearchParams } from 'react-router-dom';
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

import { edit_user_draft, fetch_draft, fetch_user_drafts } from "../utils/api";
import { SET_EDITOR_DATA, SET_USER_DRAFTS } from "../store/reducers/draft.reducers";
import '../styles/editor.scss';

import { TbArrowAutofitHeight, TbArrowAutofitWidth } from 'react-icons/tb';
import { FiZoomIn, FiZoomOut } from 'react-icons/fi';
import { BiDownload } from 'react-icons/bi';
import { MdModeEditOutline } from "react-icons/md";

import Loader from '../assets/images/updateLoader.gif';

import html2pdf from 'html2pdf.js/dist/html2pdf.min';
import EditableInput from "../components/EditableInput";
import EditableObjective from "../components/EditableObjective";
import EditableSocials from "../components/EditableSocials";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";

const Editor = () => {
    const [searchParams] = useSearchParams();

    const [updatedDraft, setUpdatedDraft] = useState({});
    const [draftUpdating, setDraftUpdating] = useState(false);
    const [editorWidth, setEditorWidth] = useState(0);
    const [viewOrder, setViewOrder] = useState('');
    const [itemsOrder, setItemsOrder] = useState([]);

    const pageRef = useRef(null);

    const [editOn, setEditOn] = useState(false);

    useEffect(() => {
        const pageWidth = window.innerWidth - 200;
        const editorWidth = pageWidth > 1280 ? 1280 : pageWidth;
        document.documentElement.style.setProperty('--editorWidth', `${editorWidth}px`);

        const draftID = searchParams.get('draftid');
        fetch_draft(draftID).then(res => {
            setUpdatedDraft({ ...updatedDraft, ...res });
            SET_EDITOR_DATA(res);
        });

        const observer = new ResizeObserver(entries => {
            const val = Math.round(entries[0].contentRect.width);
            console.log("pagewidth", val);
            setEditorWidth(val);
        })
        observer.observe(pageRef.current);
        return () => pageRef.current && observer.unobserve(pageRef.current)
    }, []);

    useEffect(() => {
        if (updatedDraft.view_order) {
            setViewOrder(updatedDraft.view_order.type);
            setItemsOrder(updatedDraft.view_order.fields_order);
        }
    }, [updatedDraft]);

    const onDragEnd = (result, items) => {
        if (!result.destination) return;
        const updatedItems = reorder(
            itemsOrder,
            result.source.index,
            result.destination.index
        );
        setItemsOrder(updatedItems);
    };

    const reorder = (list, startIndex, endIndex) => {
        const result = Array.from(list);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);
        return result;
    };

    const zoomIn = () => {
        const zoomedWidth = pageRef.current.clientWidth + 100;
        if (zoomedWidth > 1280) {
            document.documentElement.style.setProperty('--editorWidth', 1280 + "px");
        } else {
            document.documentElement.style.setProperty('--editorWidth', zoomedWidth + "px");
        }
    }

    const zoomOut = () => {
        const zoomedWidth = pageRef.current.clientWidth - 100;
        if (zoomedWidth < 320) {
            document.documentElement.style.setProperty('--editorWidth', 320 + "px");
        } else {
            document.documentElement.style.setProperty('--editorWidth', zoomedWidth + "px");
        }
    }

    const widthFit = () => {
        const maxWidth = window.innerWidth - 200;
        if (maxWidth > 1280) {
            document.documentElement.style.setProperty('--editorWidth', 1280 + "px");
        } else {
            document.documentElement.style.setProperty('--editorWidth', maxWidth + "px");
        }
    }

    const heightFit = () => {
        document.documentElement.style.setProperty('--editorWidth', ((window.innerHeight - 200) / 1.414) + "px");
    }

    const print = async () => {
        const view = pageRef.current;
        html2canvas(view, {
            scale: 2
        }).then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({ orientation: 'portrait', unit: 'in', format: 'a4' });
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            console.log(imgData)
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save('resume.pdf');
        })
        // var opt = {
        //     margin: 1,
        //     filename: "resume.pdf",
        //     image: { type: 'jpeg', quality: 0.98 },
        //     html2canvas: { scale: 2 },
        //     jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        // };
        // html2pdf().from(view).set(opt).save();
    }

    const handleSubmit = (type, field, val) => {
        setDraftUpdating(true);
        let edited_data = { ...updatedDraft };

        switch (type) {
            case 'string': {
                edited_data = {
                    ...updatedDraft,
                    data: {
                        ...updatedDraft.data,
                        [field]: val
                    }
                };
                break;
            }
            case 'object': {
                console.log('da', field, val)
                edited_data = {
                    ...updatedDraft,
                    data: {
                        ...updatedDraft.data,
                        [field]: { ...updatedDraft.data[field], ...val }
                    }
                };
                break;
            }
            case 'list': {
                console.log('list', field, val)
                edited_data = {
                    ...updatedDraft,
                    data: {
                        ...updatedDraft.data,
                        [field]: { ...val }
                    }
                };
                break;
            }
            default: break;
        }
        setUpdatedDraft(edited_data);

        // setTimeout(() => {
        //     const payload = {
        //         data: edited_data.data,
        //         type: 'content'
        //     }
        //     edit_user_draft(updatedDraft._id, payload).then(() => {
        //         fetch_draft(updatedDraft._id).then(res => {
        //             setUpdatedDraft({ ...updatedDraft, ...res });
        //             SET_EDITOR_DATA(res);
        //             setDraftUpdating(false);
        //         })
        //     })
        // }, 5000)
    }

    return (
        <div style={{ height: 'calc(100vh - 4rem)' }} className="scrollbar relative overflow-y-auto border-[3px] border-slate-400 dark:border-neutral-600 bg-slate-200 pt-8 pb-4 px-4 rounded-md">
            <div id="editor_bar" className="group fixed top-2 left-28 right-14 z-50 inset-x-0 w-auto flex flex-row justify-between opacity-100 hover:opacity-100 bg-amber-300 dark:bg-amber-300 p-2 rounded-md">
                <div className="pointer-events-none group-hover:pointer-events-auto flex flex-row space-x-3">
                    <TbArrowAutofitHeight onClick={heightFit} className="w-6 h-6 cursor-pointer text-gray-800 dark:text-gray-200" />
                    <TbArrowAutofitWidth onClick={widthFit} className="w-6 h-6 cursor-pointer text-gray-800 dark:text-gray-200" />
                    <FiZoomIn onClick={zoomIn} className="w-6 h-6 cursor-pointer text-gray-800 dark:text-gray-200" />
                    <FiZoomOut onClick={zoomOut} className="w-6 h-6 cursor-pointer text-gray-800 dark:text-gray-200" />
                </div>
                <div className="flex flex-row gap-2">
                    <MdModeEditOutline onClick={() => setEditOn(!editOn)} className="w-6 h-6 cursor-pointer text-gray-800 dark:text-gray-200" />
                    <BiDownload onClick={() => print()} className="w-6 h-6 cursor-pointer text-gray-800 dark:text-gray-200" />
                </div>
            </div>
            <div id="page" ref={pageRef} className={`tmp_${updatedDraft.template_id}`}>
                <div className="bg-layout"></div>
                <div className="personal_section">
                    <div className="name_role">
                        <EditableInput tmpID={searchParams.get('tid')} editorWidth={editorWidth} field="fullname" editOn={editOn} val={updatedDraft?.data?.fullname} handleSubmit={(ev) => handleSubmit("string", "fullname", ev.target.value)} />
                        <EditableInput tmpID={searchParams.get('tid')} editorWidth={editorWidth} field="role" editOn={editOn} val={updatedDraft?.data?.role} handleSubmit={(ev) => handleSubmit("string", "role", ev.target.value)} />
                    </div>
                    <div className="socials">
                        <EditableSocials tmpID={searchParams.get('tid')} editorWidth={editorWidth} field="socials_phone" editOn={editOn} val={updatedDraft?.data?.socials} handleSubmit={handleSubmit} handleInputChange={() => { }} />
                    </div>
                </div>
                {viewOrder === "dual" && itemsOrder.length > 0 && (
                    <div className={`objective_section ${editOn && 'edit_active'}`}>
                        <DragDropContext onDragEnd={(result) => onDragEnd(result, itemsOrder.filter(itx => itx.id.includes("d1_")))}>
                            <Droppable droppableId="droppable">
                                {provided => (
                                    <div
                                        className="dual_view"
                                        ref={provided.innerRef}
                                        {...provided.droppableProps}
                                    >
                                        <div className="view_col_1">
                                            {itemsOrder.filter(itx => itx.id.includes("d1_")).map((item, idx) => {
                                                return (
                                                    <Draggable key={item.id} draggableId={item.id} index={idx}>
                                                        {(provided) => (
                                                            <div className="relative" ref={provided.innerRef} {...provided.draggableProps}>
                                                                <EditableObjective
                                                                    provided={provided}
                                                                    tmpID={searchParams.get('tid')}
                                                                    editorWidth={editorWidth}
                                                                    field={item.label}
                                                                    editOn={editOn}
                                                                    val={updatedDraft?.data?.[item.label]}
                                                                    handleSubmit={handleSubmit}
                                                                    handleInputChange={() => { }}
                                                                />
                                                            </div>
                                                        )}
                                                    </Draggable>
                                                )
                                            }
                                            )}
                                        </div>
                                        <div className="view_col_2">
                                            {itemsOrder.filter(itx => itx.id.includes("d2_")).map((item, idx) => {
                                                return (
                                                    <Draggable key={item.id} draggableId={item.id} index={idx + itemsOrder.filter(itx => itx.id.includes("d2_")).length - 1}>
                                                        {(provided) => (
                                                            <div className="relative" ref={provided.innerRef} {...provided.draggableProps}>
                                                                <EditableObjective
                                                                    provided={provided}
                                                                    tmpID={searchParams.get('tid')}
                                                                    editorWidth={editorWidth}
                                                                    field={item.label}
                                                                    editOn={editOn}
                                                                    val={updatedDraft?.data?.[item.label]}
                                                                    handleSubmit={handleSubmit}
                                                                    handleInputChange={() => { }} />
                                                            </div>
                                                        )}
                                                    </Draggable>
                                                )
                                            })}
                                        </div>
                                    </div>
                                )}
                            </Droppable>
                        </DragDropContext>
                    </div>
                )}
                {viewOrder === "single" && itemsOrder.length > 0 && (
                    <div className="objective_section" >
                        <DragDropContext onDragEnd={(result) => onDragEnd(result, itemsOrder.filter(itx => itx.id.includes("d1_")))}>
                            <Droppable droppableId="droppable">
                                {provided => (
                                    <div
                                        // className="dual_view"
                                        ref={provided.innerRef}
                                        {...provided.droppableProps}
                                    >
                                        {itemsOrder.filter(itx => itx.id.includes("d2_")).map((item, idx) => {
                                            return (
                                                <Draggable key={item.id} draggableId={item.id} index={idx}>
                                                    {(provided) => (
                                                        <div className="relative" ref={provided.innerRef} {...provided.draggableProps}>
                                                            <EditableObjective
                                                                provided={provided}
                                                                draftID={searchParams.get('draftid')}
                                                                editorWidth={editorWidth}
                                                                field={item.label}
                                                                val={updatedDraft?.data?.[item.label]}
                                                                handleSubmit={handleSubmit}
                                                                handleInputChange={() => { }} />
                                                        </div>
                                                    )}
                                                </Draggable>
                                            )
                                        })}
                                    </div>
                                )}
                            </Droppable>
                        </DragDropContext>
                    </div>
                )}
                {/* 
                <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable droppableId="droppable">
                        {(provided) => (
                            <div
                                className="objective_section"
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                            >
                                {viewOrder === "dual" && itemsOrder.length > 0 && (
                                    <div className="dual_view">
                                        <div className="view_col_1">
                                            {itemsOrder.filter(itx => itx.id.includes("d1_")).map((item, idx) => {
                                                return (
                                                    <Draggable key={item.id} draggableId={item.id} index={idx}>
                                                        {(provided) => (
                                                            <div className="relative" ref={provided.innerRef} {...provided.draggableProps}>
                                                                <EditableObjective
                                                                    provided={provided}
                                                                    tmpID={searchParams.get('tid')}
                                                                    editorWidth={editorWidth}
                                                                    field={item.label}
                                                                    val={updatedDraft?.data?.[item.label]}
                                                                    handleSubmit={handleSubmit}
                                                                    handleInputChange={() => { }} />
                                                            </div>
                                                        )}
                                                    </Draggable>
                                                )
                                            }
                                            )}
                                        </div>
                                        <div className="view_col_2">
                                            {itemsOrder.filter(itx => itx.id.includes("d2_")).map((item, idx) => {
                                                return (
                                                    <Draggable key={item.id} draggableId={item.id} index={idx}>
                                                        {(provided) => (
                                                            <div className="relative" ref={provided.innerRef} {...provided.draggableProps}>
                                                                <EditableObjective
                                                                    provided={provided}
                                                                    draftID={searchParams.get('draftid')}
                                                                    editorWidth={editorWidth}
                                                                    field={item.label}
                                                                    val={updatedDraft?.data?.[item.label]}
                                                                    handleSubmit={handleSubmit}
                                                                    handleInputChange={() => { }} />
                                                            </div>
                                                        )}
                                                    </Draggable>
                                                )
                                            }
                                            )}
                                        </div>
                                    </div>
                                )}
                                {viewOrder === "single" && itemsOrder.length > 0 && itemsOrder.map((item, idx) => {
                                    return (
                                        <Draggable key={item.id} draggableId={item.id} index={idx}>
                                            {(provided) => (
                                                <div className="relative" ref={provided.innerRef} {...provided.draggableProps}>
                                                    <EditableObjective
                                                        provided={provided}
                                                        draftID={searchParams.get('draftid')}
                                                        editorWidth={editorWidth}
                                                        field={item.label}
                                                        val={updatedDraft?.data?.[item.label]}
                                                        handleSubmit={handleSubmit}
                                                        handleInputChange={() => { }} />
                                                </div>
                                            )}
                                        </Draggable>
                                    )
                                })}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </DragDropContext> */}
                {draftUpdating && <div className="absolute z-50 right-2 bottom-2">
                    <img src={Loader} className="h-auto w-12" />
                </div>}
            </div >
        </div >
    )
}

export default Editor;