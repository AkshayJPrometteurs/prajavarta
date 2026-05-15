"use client"

import React, { memo, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";

const Newsletter = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const validationSchema = Yup.object().shape({
        email: Yup.string()
            .email("Invalid email address")
            .required("Email is required")
    });

    const handleSubmit = async (values, { resetForm }) => {
        setIsSubmitting(true);
        try {
            const response = await fetch('/api/newsletter/subscribe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: values.email }),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success(data.message || "Successfully subscribed!");
                resetForm();
            } else {
                toast.error(data.error || "Subscription failed");
            }
        } catch (error) {
            toast.error("An error occurred. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-(--brand-primary-light) p-4 sm:p-5 border-l-[3px] border-(--brand-primary)">
            <div className="mr text-sm font-bold text-(--brand-primary) mb-1.5">
                दैनिक न्यूजलेटर
            </div>

            <p className="mr text-[13px] text-(--text-secondary) leading-normal mb-3">
                दिवसाच्या मुख्य बातम्या थेट आपल्या इनबॉक्समध्ये.
            </p>

            <Formik
                initialValues={{ email: "" }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ errors, touched }) => (
                    <Form>
                        <div className="flex flex-col sm:flex-row gap-2">
                            <div className="flex-1">
                                <Field
                                    type="email"
                                    name="email"
                                    placeholder="email@example.com"
                                    className={`w-full px-3 py-2 border rounded text-[13px] bg-white outline-none font-inherit ${
                                        errors.email && touched.email
                                            ? "border-red-500"
                                            : "border-(--border-default)"
                                    }`}
                                />
                                <ErrorMessage
                                    name="email"
                                    component="div"
                                    className="text-red-500 text-[11px] mt-1"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="bg-(--brand-primary) text-white border-0 px-4 py-2 rounded text-[13px] font-semibold cursor-pointer whitespace-nowrap w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? "Subscribing..." : "Subscribe"}
                            </button>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default memo(Newsletter);