import { useEffect, useRef, useState } from 'react';
import '../styles/Editor.css';

import { BiCheck } from 'react-icons/bi';
import { MdAdd, MdRemove, MdClose } from 'react-icons/md';
import { RiDragMove2Line } from 'react-icons/ri';

const EditableObjective = (props) => {
    const { draftID, pageWidth, field, val, handleSubmit, handleInputChange } = props;

    const [editVal, setEditVal] = useState(val);
    const [mainEdit, setMainEdit] = useState(false);

    useEffect(() => {
        setEditVal(val);
    }, [val])

    const inWidth = (value) => {
        if (value === undefined) {
            return { width: '0ch' };
        }
        var len = (value.length > (pageWidth * 0.0878)) ? pageWidth * 0.0878 : value.length;
        len = len > 85 ? 85 : len;
        // var len = value.length;
        len += 1;
        return { width: len + 'ch' };
    }

    const calcFontDimensions = (fld) => {
        switch (fld) {
            case 'objective_title': { return { fontSize: `calc(${pageWidth}px * 0.024)`, lineHeight: `calc(${pageWidth}px * 0.026)` } }
            case 'skills_label': { return { fontSize: `calc(${pageWidth}px * 0.018)`, lineHeight: `calc(${pageWidth}px * 0.020)` } }
            case 'skills_value': { return { fontSize: `calc(${pageWidth}px * 0.018)`, lineHeight: `calc(${pageWidth}px * 0.020)` } }
            case 'experience_role': { return { fontSize: `calc(${pageWidth}px * 0.018)`, lineHeight: `calc(${pageWidth}px * 0.020)` } }
            case 'experience_company': { return { fontSize: `calc(${pageWidth}px * 0.017)`, lineHeight: `calc(${pageWidth}px * 0.019)` } }
            case 'experience_location': { return { fontSize: `calc(${pageWidth}px * 0.017)`, lineHeight: `calc(${pageWidth}px * 0.019)` } }
            case 'experience_period': { return { fontSize: `calc(${pageWidth}px * 0.017)`, lineHeight: `calc(${pageWidth}px * 0.019)` } }
            case 'exp_value': { return { fontSize: `calc(${pageWidth}px * 0.016)`, lineHeight: `calc(${pageWidth}px * 0.018)` } }
            case 'project_name': { return { fontSize: `calc(${pageWidth}px * 0.018)`, lineHeight: `calc(${pageWidth}px * 0.020)` } }
            case 'project_links': { return { fontSize: `calc(${pageWidth}px * 0.016)`, lineHeight: `calc(${pageWidth}px * 0.018)` } }
            case 'proj_value': { return { fontSize: `calc(${pageWidth}px * 0.016)`, lineHeight: `calc(${pageWidth}px * 0.018)` } }
            case 'education_course': { return { fontSize: `calc(${pageWidth}px * 0.018)`, lineHeight: `calc(${pageWidth}px * 0.020)` } }
            case 'education_institute': { return { fontSize: `calc(${pageWidth}px * 0.018)`, lineHeight: `calc(${pageWidth}px * 0.020)` } }
            case 'education_grade': { return { fontSize: `calc(${pageWidth}px * 0.018)`, lineHeight: `calc(${pageWidth}px * 0.020)` } }
            case 'education_location': { return { fontSize: `calc(${pageWidth}px * 0.018)`, lineHeight: `calc(${pageWidth}px * 0.020)` } }
            case 'education_period': { return { fontSize: `calc(${pageWidth}px * 0.018)`, lineHeight: `calc(${pageWidth}px * 0.020)` } }
            case 'achievements_item': { return { fontSize: `calc(${pageWidth}px * 0.018)`, lineHeight: `calc(${pageWidth}px * 0.020)` } }
            case 'achievements_period': { return { fontSize: `calc(${pageWidth}px * 0.018)`, lineHeight: `calc(${pageWidth}px * 0.020)` } }
            case 'edit_actions': { return { top: `calc(${pageWidth}px * -0.007)`, right: 0 } }
            case 'edit_icon': { return { height: `calc(${pageWidth}px * 0.018)`, width: `calc(${pageWidth}px * 0.018)` } }
            case 'edit_value_close': { return { height: `calc(${pageWidth}px * 0.012)`, width: `calc(${pageWidth}px * 0.012)`, top: 0 } }
            case 'drag_icon': { return { top: `calc(${pageWidth}px * -0.007)`, left: 0, height: `calc(${pageWidth}px * 0.018)`, width: `calc(${pageWidth}px * 0.018)` } }
        }
    }

    const normalView = () => {
        switch (field) {
            case 'skills':
                return <div onClick={() => setMainEdit(true)} className="skills_view">
                    <div className="header_title">
                        <h2 style={{ ...calcFontDimensions('objective_title') }}>{editVal?.title}</h2>
                        <hr className="header_line" />
                    </div>
                    <div className="skills_content">
                        {editVal?.content_data?.map((skill, index) => (
                            <div key={index} className="skills_content_item">
                                <div style={{ ...calcFontDimensions('skills_label') }} className="skills_labels">{skill.label}</div>
                                <div style={{ ...calcFontDimensions('skills_value') }} className="skills_values">{skill.content_values.join(', ')}</div>
                            </div>
                        ))}
                    </div>
                </div>
            case 'experience':
                return <div onClick={() => setMainEdit(true)} className="experience_view">
                    <div className="header_title">
                        <h2 style={{ ...calcFontDimensions('objective_title') }}>{editVal?.title}</h2>
                        <hr className="header_line" />
                    </div>
                    <div className="experience_content">
                        {editVal?.content?.map((exp, index) => (
                            <div key={index} className="experience_content_item">
                                <div className="experience_titles">
                                    <div className="experience_titles_left">
                                        <p style={{ ...calcFontDimensions('experience_role') }} className="experience_role">{exp.role}</p>
                                        <p style={{ ...calcFontDimensions('experience_company') }} className="experience_company">{exp.company}</p>
                                    </div>
                                    <div className="experience_titles_right">
                                        <p style={{ ...calcFontDimensions('experience_location') }} className="experience_location">{exp.location}</p>
                                        <p style={{ ...calcFontDimensions('experience_period') }} className="experience_period">{exp.period_from} - {exp.period_to}</p>
                                    </div>
                                </div>
                                <ul className="experience_description">
                                    {exp.description_list.map((exp_desc_item, index) => (
                                        <li key={index} className='mb-0.5 last:mb-0' style={{ ...calcFontDimensions('exp_value') }}>{exp_desc_item}</li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            case 'projects':
                return <div onClick={() => setMainEdit(true)} className="projects_view">
                    <div className="header_title">
                        <h2 style={{ ...calcFontDimensions('objective_title') }}>{editVal?.title}</h2>
                        <hr className="header_line" />
                    </div>
                    <div className="project_content">
                        {editVal?.content?.map((proj, index) => (
                            <div key={index} className="project_content_item">
                                <div className="project_titles">
                                    <p style={{ ...calcFontDimensions('project_name') }} className="project_name">{proj.name}</p>
                                    <p style={{ ...calcFontDimensions('project_links') }} className="project_links">{proj.project_link} | {proj.github_link}</p>
                                </div>
                                <div className="project_description">
                                    {proj.description_list.map((itx, index) => (
                                        <li key={index} style={{ ...calcFontDimensions('proj_value') }}>{itx}</li>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            case 'education':
                return <div onClick={() => setMainEdit(true)} className="education_view">
                    <div className="header_title">
                        <h2 style={{ ...calcFontDimensions('objective_title') }}>{editVal?.title}</h2>
                        <hr className="header_line" />
                    </div>
                    <div className="education_content">
                        {editVal?.content?.map((edu, index) => (
                            <div key={index} className="education_content_item">
                                <div className="education_titles">
                                    <div className="education_titles_left">
                                        <p style={{ ...calcFontDimensions('education_course') }} className="education_course">{edu.course}</p>
                                        <p style={{ ...calcFontDimensions('education_institute') }} className="education_institute">{edu.institute}</p>
                                        <p style={{ ...calcFontDimensions('education_grade') }} className="education_grade">Grade</p>
                                    </div>
                                    <div className="education_titles_right">
                                        <p style={{ ...calcFontDimensions('education_location') }} className="education_location">{edu.location}</p>
                                        <p style={{ ...calcFontDimensions('education_period') }} className="education_period">{edu.period_from} - {edu.period_to}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            case 'achievements':
                return <div onClick={() => setMainEdit(true)} className="achievements_view">
                    <div className="header_title">
                        <h2 style={{ ...calcFontDimensions('objective_title') }}>{editVal?.title}</h2>
                        <hr className="header_line" />
                    </div>
                    <div className="achievements_content">
                        {editVal?.content_data?.map((ach, index) => (
                            <div key={index} className="achievements_content_item">
                                <p style={{ ...calcFontDimensions('achievements_item') }} className="achievements_item">{ach.title}</p>
                                <p style={{ ...calcFontDimensions('achievements_period') }} className="achievements_period">{ach.period}</p>
                            </div>
                        ))}
                    </div>
                </div>
        }
    }

    const editView = () => {
        switch (field) {
            case 'skills':
                return <div draggable className="skills_edit">
                    <div className="header_title">
                        <input className='editInput' style={{ ...calcFontDimensions('objective_title'), ...inWidth(editVal?.title) }} type="text" value={editVal?.title} onChange={(ev) => setEditVal({ ...editVal, title: ev.target.value })} />
                        <hr className="header_line" />
                    </div>
                    <div className="skills_content">
                        {editVal?.content_data && editVal?.content_data.map((skill, index) => (
                            <div key={index} className="skills_content_item">
                                {/* <MdRemove onClick={() => {
                                        // var list = ;
                                        setEditVal(prevVal => ({
                                            ...prevVal,
                                            content_data: [...prevVal.content_data.filter((x, i) => i !== index)]
                                        }))
                                    }} className='skills_value_remove' /> */}
                                <input className='skills_label_value' style={{ ...calcFontDimensions('skills_label'), ...inWidth(skill.label) }} type="text" value={skill.label} onChange={(ev) => {
                                    let clone = [...editVal.content_data];
                                    let obj = clone[index];
                                    obj.label = ev.target.value;
                                    clone[index] = obj;
                                    setEditVal({ ...editVal, content_data: [...clone] })
                                }} />
                                <div className='skills_content_cell'>
                                    <div className='skills_content_values'>
                                        {skill.content_values.map((itx, idx) => (
                                            <div className='relative'>
                                                <input className='skills_value' style={{ ...calcFontDimensions('skills_value'), ...inWidth(itx) }} type="text" value={itx} onChange={(ev) => {
                                                    let clone = [...editVal.content_data];
                                                    let obj = clone[index];
                                                    let list = obj.content_values;
                                                    list[idx] = ev.target.value;
                                                    obj.content_values = list;
                                                    clone[index] = obj;
                                                    setEditVal({ ...editVal, content_data: [...clone] })
                                                }} />
                                                <MdClose onClick={() => {
                                                    let updated = editVal;
                                                    updated.content_data[index].content_values = updated.content_data[index].content_values.filter((x, i) => i !== idx);
                                                    setEditVal({ ...updated })
                                                }} style={{ ...calcFontDimensions("edit_value_close") }} className='edit_value_close' />
                                            </div>
                                        ))}
                                        <MdAdd className='skills_value_add' onClick={() => {
                                            let updated = editVal;
                                            const newVal = updated.content_data[index].content_values.length + 1;
                                            updated.content_data[index].content_values.push(`Skill ${newVal}`);
                                            setEditVal({ ...updated })
                                        }} />
                                    </div>
                                </div>
                            </div>
                        ))}
                        <MdAdd className='skills_add' onClick={() => {
                            setEditVal(prevVal => ({
                                ...prevVal,
                                content_data: [...prevVal.content_data, { label: 'Skill Label 3', content_values: ['skill test 1', 'skill test 2'] }]
                            }))
                        }} />
                    </div>
                    <RiDragMove2Line style={{ ...calcFontDimensions("drag_icon") }} className='drag_icon' />
                    <div className='edit_actions' style={{ ...calcFontDimensions("edit_actions") }}>
                        <BiCheck onClick={() => { handleSubmit('list', field, editVal); setMainEdit(false) }} style={{ ...calcFontDimensions("edit_icon") }} className='edit_icon' />
                        <MdClose onClick={() => { setMainEdit(false) }} style={{ ...calcFontDimensions("edit_icon") }} className='edit_icon' />
                    </div>
                </div>
            case 'experience':
                return <div draggable className="experience_edit">
                    <div className="header_title">
                        <input className='editInput' style={{ ...calcFontDimensions('objective_title'), ...inWidth(editVal?.title) }} type="text" value={editVal?.title} onChange={(ev) => setEditVal({ ...editVal, title: ev.target.value })} />
                        <hr className="header_line" />
                    </div>
                    <div className="experience_content">
                        {editVal?.content && editVal?.content.map((exp, index) => (
                            <div key={index} className="experience_content_item">
                                <div className="experience_titles">
                                    <div className="experience_titles_left">
                                        <input className='experience_role' style={{ ...calcFontDimensions('experience_role'), ...inWidth(exp.role) }} type="text" value={exp.role} onChange={(ev) => {
                                            let clone = [...editVal.content];
                                            let obj = clone[index];
                                            obj.role = ev.target.value;
                                            clone[index] = obj;
                                            setEditVal({ ...editVal, content: [...clone] })
                                        }} />
                                        <input className='experience_company' style={{ ...calcFontDimensions('experience_company'), ...inWidth(exp.company) }} type="text" value={exp.company} onChange={(ev) => {
                                            let clone = [...editVal.content];
                                            let obj = clone[index];
                                            obj.company = ev.target.value;
                                            clone[index] = obj;
                                            setEditVal({ ...editVal, content: [...clone] })
                                        }} />
                                    </div>
                                    <div className="experience_titles_right">
                                        <input className='experience_location' style={{ ...calcFontDimensions('experience_location'), ...inWidth(exp.location) }} type="text" value={exp.location} onChange={(ev) => {
                                            let clone = [...editVal.content];
                                            let obj = clone[index];
                                            obj.location = ev.target.value;
                                            clone[index] = obj;
                                            setEditVal({ ...editVal, content: [...clone] })
                                        }} />
                                        <div className='experience_period'>
                                            <input className='experience_period_from' style={{ ...calcFontDimensions('experience_period'), ...inWidth(exp.period_from) }} type="text" value={exp.period_from} onChange={(ev) => {
                                                let clone = [...editVal.content];
                                                let obj = clone[index];
                                                obj.period_from = ev.target.value;
                                                clone[index] = obj;
                                                setEditVal({ ...editVal, content: [...clone] })
                                            }} />
                                            <span style={{ ...calcFontDimensions('experience_period') }}>-</span>
                                            <input className='experience_period_to' style={{ ...calcFontDimensions('experience_period'), ...inWidth(exp.period_to) }} type="text" value={exp.period_to} onChange={(ev) => {
                                                let clone = [...editVal.content];
                                                let obj = clone[index];
                                                obj.period_to = ev.target.value;
                                                clone[index] = obj;
                                                setEditVal({ ...editVal, content: [...clone] })
                                            }} />
                                        </div>
                                    </div>
                                </div>
                                <div className="experience_description">
                                    {exp.description_list.map((itx, idx) => (
                                        <li>
                                            <input key={index} className='exp_value' style={{ ...calcFontDimensions('exp_value'), ...inWidth(itx) }} type="text" value={itx} onChange={(ev) => {
                                                let clone = [...editVal.content];
                                                let obj = clone[index];
                                                let list = obj.description_list;
                                                list[idx] = ev.target.value;
                                                obj.description_list = list;
                                                clone[index] = obj;
                                                setEditVal({ ...editVal, content: [...clone] })
                                            }} />
                                        </li>
                                    ))}
                                    <MdAdd className='exp_value_add' onClick={() => {
                                        let updated = editVal;
                                        updated.content[index].description_list.push('Highlight your responsibilites, your contributions and your achievements in the position.');
                                        setEditVal({ ...updated })
                                    }} />
                                </div>
                            </div>
                        ))}
                        <MdAdd className='experience_add' onClick={() => {
                            setEditVal(prevVal => ({
                                ...prevVal,
                                content: [...prevVal.content,
                                {
                                    role: "Your Job Title",
                                    company: "Your Company / Agency",
                                    location: "Job Location",
                                    period_from: "XXXX",
                                    period_to: "XXXX",
                                    description_type: "unordered_list",
                                    description_list: [
                                        "Highlight your responsibilites, your contributions and your achievements in the position."
                                    ],
                                }]
                            }))
                        }} />
                    </div>
                    <div className='edit_actions' style={{ ...calcFontDimensions("edit_actions") }}>
                        <BiCheck onClick={() => { handleSubmit('list', field, editVal); setMainEdit(false) }} style={{ ...calcFontDimensions("edit_icon") }} className='edit_icon' />
                        <MdClose onClick={() => { setMainEdit(false) }} style={{ ...calcFontDimensions("edit_icon") }} className='edit_icon' />
                    </div>
                </div>
            case 'projects':
                return <div draggable className="projects_edit">
                    <div className="header_title">
                        <input className='editInput' style={{ ...calcFontDimensions('objective_title'), ...inWidth(editVal?.title) }} type="text" value={editVal?.title} onChange={(ev) => setEditVal({ ...editVal, title: ev.target.value })} />
                        <hr className="header_line" />
                    </div>
                    <div className="project_content">
                        {editVal?.content && editVal?.content.map((proj, index) => (
                            <div key={index} className="project_content_item">
                                <div className="project_titles">
                                    <input className='project_name' style={{ ...calcFontDimensions('project_name'), ...inWidth(proj.name) }} type="text" value={proj.name} onChange={(ev) => {
                                        let clone = [...editVal.content];
                                        let obj = clone[index];
                                        obj.name = ev.target.value;
                                        clone[index] = obj;
                                        setEditVal({ ...editVal, content: [...clone] })
                                    }} />
                                    <div className='project_links'>
                                        <input className='link' style={{ ...calcFontDimensions('project_links'), ...inWidth(proj.project_link) }} type="text" value={proj.project_link} onChange={(ev) => {
                                            let clone = [...editVal.content];
                                            let obj = clone[index];
                                            obj.project_link = ev.target.value;
                                            clone[index] = obj;
                                            setEditVal({ ...editVal, content: [...clone] })
                                        }} />
                                        <input className='link' style={{ ...calcFontDimensions('project_links'), ...inWidth(proj.github_link) }} type="text" value={proj.github_link} onChange={(ev) => {
                                            let clone = [...editVal.content];
                                            let obj = clone[index];
                                            obj.github_link = ev.target.value;
                                            clone[index] = obj;
                                            setEditVal({ ...editVal, content: [...clone] })
                                        }} />
                                    </div>
                                </div>
                                <div className="project_description">
                                    {proj.description_list.map((itx, idx) => (
                                        <li>
                                            <input key={index} className='proj_value' style={{ ...calcFontDimensions('proj_value'), ...inWidth(itx) }} type="text" value={itx} onChange={(ev) => {
                                                let clone = [...editVal.content];
                                                let obj = clone[index];
                                                let list = obj.description_list;
                                                list[idx] = ev.target.value;
                                                obj.description_list = list;
                                                clone[index] = obj;
                                                setEditVal({ ...editVal, content: [...clone] })
                                            }} />
                                        </li>
                                    ))}
                                    <MdAdd className='proj_value_add' onClick={() => {
                                        let updated = editVal;
                                        updated.content[index].description_list.push('Highlight your responsibilites, your contributions and your achievements in the position.');
                                        setEditVal({ ...updated })
                                    }} />
                                </div>
                            </div>
                        ))}
                        <MdAdd className='projects_add' onClick={() => {
                            setEditVal(prevVal => ({
                                ...prevVal,
                                content: [...prevVal.content,
                                {
                                    name: "Project Name",
                                    project_link: "Project Link",
                                    github_link: "Github Link",
                                    description_type: "unordered_list",
                                    description_list: [
                                        "Highlight your responsibilites, your contributions and your achievements in the position."
                                    ],
                                }
                                ]
                            }))
                        }} />
                    </div>
                    <div className='edit_actions' style={{ ...calcFontDimensions("edit_actions") }}>
                        <BiCheck onClick={() => { handleSubmit('list', field, editVal); setMainEdit(false) }} style={{ ...calcFontDimensions("edit_icon") }} className='edit_icon' />
                        <MdClose onClick={() => { setMainEdit(false) }} style={{ ...calcFontDimensions("edit_icon") }} className='edit_icon' />
                    </div>
                </div>
            case 'education':
                return <div draggable className="education_edit">
                    <div className="header_title">
                        <input className='editInput' style={{ ...calcFontDimensions('objective_title'), ...inWidth(editVal?.title) }} type="text" value={editVal?.title} onChange={(ev) => setEditVal({ ...editVal, title: ev.target.value })} />
                        <hr className="header_line" />
                    </div>
                    <div className="education_content">
                        {editVal?.content && editVal?.content.map((edu, index) => (
                            <div key={index} className="education_content_item">
                                <div className="education_titles">
                                    <div className="education_titles_left">
                                        <input className='education_course' style={{ ...calcFontDimensions('education_course'), ...inWidth(edu.course) }} type="text" value={edu.course} onChange={(ev) => {
                                            let clone = [...editVal.content];
                                            let obj = clone[index];
                                            obj.course = ev.target.value;
                                            clone[index] = obj;
                                            setEditVal({ ...editVal, content: [...clone] })
                                        }} />
                                        <input className='education_institute' style={{ ...calcFontDimensions('education_institute'), ...inWidth(edu.institute) }} type="text" value={edu.institute} onChange={(ev) => {
                                            let clone = [...editVal.content];
                                            let obj = clone[index];
                                            obj.institute = ev.target.value;
                                            clone[index] = obj;
                                            setEditVal({ ...editVal, content: [...clone] })
                                        }} />
                                        <input className='education_grade' style={{ ...calcFontDimensions('education_grade'), ...inWidth('Grade') }} type="text" value={'Grade'} onChange={(ev) => {
                                            // let clone = [...editVal.content];
                                            // let obj = clone[index];
                                            // obj.name = ev.target.value;
                                            // clone[index] = obj;
                                            // setEditVal({ ...editVal, content: [...clone] })
                                        }} />
                                    </div>
                                    <div className="education_titles_right">
                                        <input className='education_location' style={{ ...calcFontDimensions('education_location'), ...inWidth(edu.location) }} type="text" value={edu.location} onChange={(ev) => {
                                            let clone = [...editVal.content];
                                            let obj = clone[index];
                                            obj.location = ev.target.value;
                                            clone[index] = obj;
                                            setEditVal({ ...editVal, content: [...clone] })
                                        }} />
                                        <div className='education_period'>
                                            <input className='education_period_from' style={{ ...calcFontDimensions('education_period'), ...inWidth(edu.period_from) }} type="text" value={edu.period_from} onChange={(ev) => {
                                                let clone = [...editVal.content];
                                                let obj = clone[index];
                                                obj.period_from = ev.target.value;
                                                clone[index] = obj;
                                                setEditVal({ ...editVal, content: [...clone] })
                                            }} />
                                            <input className='education_period_to' style={{ ...calcFontDimensions('education_period'), ...inWidth(edu.period_to) }} type="text" value={edu.period_to} onChange={(ev) => {
                                                let clone = [...editVal.content];
                                                let obj = clone[index];
                                                obj.period_to = ev.target.value;
                                                clone[index] = obj;
                                                setEditVal({ ...editVal, content: [...clone] })
                                            }} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                        <MdAdd className='education_add' onClick={() => {
                            setEditVal(prevVal => ({
                                ...prevVal,
                                content: [...prevVal.content,
                                {
                                    course: "Your course / degree",
                                    institute: "Your institute / school",
                                    location: "Institute / School Location",
                                    period_from: "XXXX",
                                    period_to: "XXXX",
                                }
                                ]
                            }))
                        }} />
                    </div>
                    <div className='edit_actions' style={{ ...calcFontDimensions("edit_actions") }}>
                        <BiCheck onClick={() => { handleSubmit('list', field, editVal); setMainEdit(false) }} style={{ ...calcFontDimensions("edit_icon") }} className='edit_icon' />
                        <MdClose onClick={() => { setMainEdit(false) }} style={{ ...calcFontDimensions("edit_icon") }} className='edit_icon' />
                    </div>
                </div>
            case 'achievements':
                return <div draggable className="achievements_edit">
                    <div className="header_title">
                        <input className='editInput' style={{ ...calcFontDimensions('objective_title'), ...inWidth(editVal?.title) }} type="text" value={editVal?.title} onChange={(ev) => setEditVal({ ...editVal, title: ev.target.value })} />
                        <hr className="header_line" />
                    </div>
                    <div className="achievements_content">
                        {editVal?.content_data && editVal?.content_data.map((ach, index) => (
                            <div key={index} className="achievements_content_item">
                                <input className='achievements_item' style={{ ...calcFontDimensions('achievements_item'), ...inWidth(ach.title) }} type="text" value={ach.title} onChange={(ev) => {
                                    let list = [...editVal.content_data];
                                    list[index].title = ev.target.value;
                                    setEditVal({ ...editVal, content_data: [...list] })
                                }} />
                                <input className='achievements_period' style={{ ...calcFontDimensions('achievements_period'), ...inWidth(ach.period) }} type="text" value={ach.period} onChange={(ev) => {
                                    let list = [...editVal.content_data];
                                    list[index].period = ev.target.value;
                                    setEditVal({ ...editVal, content_data: [...list] })
                                }} />
                            </div>
                        ))}
                        <MdAdd className='achievements_add' onClick={() => {
                            setEditVal(prevVal => ({
                                ...prevVal,
                                content_data: [...prevVal.content_data, 'achievement_3']
                            }))
                        }} />
                    </div>
                    <div className='edit_actions' style={{ ...calcFontDimensions("edit_actions") }}>
                        <BiCheck onClick={() => { handleSubmit('list', field, editVal); setMainEdit(false) }} style={{ ...calcFontDimensions("edit_icon") }} className='edit_icon' />
                        <MdClose onClick={() => { setMainEdit(false) }} style={{ ...calcFontDimensions("edit_icon") }} className='edit_icon' />
                    </div>
                </div>
        }
    }

    return (
        <div className={field + " relative"}>
            {!mainEdit ? normalView() : editView()}
        </div>
    )
}

export default EditableObjective;