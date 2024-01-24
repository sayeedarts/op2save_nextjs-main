import React from 'react'

const InputErrorDiv = ({ formik, elm }) => {
    return (
        <>
            {
                formik.touched[elm] && formik.errors[elm] ?
                    <div className="invalid-feedback" style={{ 'display': 'block' }}>
                        {formik.errors[elm]}
                    </div>
                    : null
            }
        </>
    )
}

export default InputErrorDiv
