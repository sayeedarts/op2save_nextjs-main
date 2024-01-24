import React from 'react'

const FormikValidationError = ({ errors, touched, elm }) => {
    return (
        <>
            {errors[elm] && touched[elm] ? (
                <div className="invalid-feedback" style={{ 'display': 'block' }}> {errors[elm]} </div>
            ) : null}
        </>
    )
}

export default FormikValidationError
