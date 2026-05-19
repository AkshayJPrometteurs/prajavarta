import * as Yup from 'yup'

export const smtpSchemas = Yup.object({
    smtpType: Yup.string()
        .trim()
        .oneOf(['gmail', 'server'], 'Invalid SMTP type')
        .required('SMTP Type is required'),

    host: Yup.string()
        .trim()
        .required('SMTP Host is required')
        .min(6, 'SMTP Host is too short')
        .max(255, 'SMTP Host is too long')
        .matches(
            /^(?=.{1,255}$)([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/,
            'Enter valid SMTP host like smtp.gmail.com'
        )
        .test(
            'no-protocol',
            'Do not include http:// or https://',
            (value) => !/^https?:\/\//i.test(value || '')
        )
        .test(
            'no-spaces',
            'Spaces are not allowed',
            (value) => !/\s/.test(value || '')
        )
        .test(
            'no-trailing-dot',
            'Host should not end with dot',
            (value) => !/\.$/.test(value || '')
        ),

    email: Yup.string()
        .trim()
        .email('Invalid email address')
        .required('Email is required')
        .max(255, 'Email is too long')
        .matches(
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            'Enter a valid email address'
        ),

    password: Yup.string().required('Password is required'),

    secure: Yup.string()
        .oneOf(['TLS', 'SSL', 'None'], 'Invalid security type')
        .required('SMTP Secure is required'),

    port: Yup.number()
        .typeError('Port must be a valid number')
        .required('Port is required')
        .integer('Port must be integer')
        .min(1, 'Minimum port is 1')
        .max(65535, 'Maximum port is 65535')
})