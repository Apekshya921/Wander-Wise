import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import * as z from 'zod';

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../components/ui/card';

import { Field, FieldError, FieldLabel } from '../components/ui/field';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';

import api from '../api/axios';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';


const formSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(5, 'Name must be at least 5 characters'),

    email: z
      .string()
      .trim()
      .email('Please enter a valid email')
      .min(8, 'Email is too short'),

    password: z
      .string()
      .trim()
      .min(8, 'Password must be at least 8 characters'),

    confirmPassword: z
      .string()
      .trim()
      .min(8, 'Password must be at least 8 characters'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });


const Register = () => {
  const navigate = useNavigate();

  const { token } = useAuth();

  // Redirect logged-in users
  useEffect(() => {
    if (token) {
      navigate('/dashboard');
    }
  }, [token, navigate]);


  const form = useForm({
    resolver: zodResolver(formSchema),

    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });


  const onSubmit = async (data) => {
    console.log(data);

    // Don't send confirmPassword to backend
    const { confirmPassword, ...newData } = data;

    try {
      const response = await api.post('/auth/register', newData);

      if (response.status === 201) {
        toast.success('Account created successfully');
        navigate('/login');
      } else {
        toast.error('Registration failed');
      }
    } catch (error) {
  console.log("STATUS:", error.response?.status);
  console.log("BACKEND ERROR:", error.response?.data);

  console.log(
    "VALIDATION ERRORS:",
    JSON.stringify(error.response?.data?.errors, null, 2)
  );

  console.log(error)

  toast.error("Registration failed");
}
  };


  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>

      <Card className="w-1/4 mx-auto mt-30">

        <CardHeader>
          <CardTitle>Register to Wanderwise</CardTitle>

          <CardDescription>
            Enter your credentials to continue.
          </CardDescription>

          <CardAction>
            <img
              src="/wanderwiseLogo.png"
              alt="Wanderwise logo"
              className="w-12"
            />
          </CardAction>
        </CardHeader>


        <CardContent className="space-y-4">

          {/* NAME */}
          <Controller
            name="name"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>

                <FieldLabel htmlFor={field.name}>
                  Enter your name
                </FieldLabel>

                <Input
                  {...field}
                  id={field.name}
                  type="text"
                  placeholder="Apekshya Timsina"
                  aria-invalid={fieldState.invalid}
                />

                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}

              </Field>
            )}
          />


          {/* EMAIL */}
          <Controller
            name="email"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>

                <FieldLabel htmlFor={field.name}>
                  Enter your email
                </FieldLabel>

                <Input
                  {...field}
                  id={field.name}
                  type="email"
                  placeholder="apeksyatimsina65@gmail.com"
                  aria-invalid={fieldState.invalid}
                />

                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}

              </Field>
            )}
          />


          {/* PASSWORD */}
          <Controller
            name="password"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>

                <FieldLabel htmlFor={field.name}>
                  Enter your password
                </FieldLabel>

                <Input
                  {...field}
                  id={field.name}
                  type="password"
                  placeholder="********"
                  aria-invalid={fieldState.invalid}
                />

                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}

              </Field>
            )}
          />


          {/* CONFIRM PASSWORD */}
          <Controller
            name="confirmPassword"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>

                <FieldLabel htmlFor={field.name}>
                  Confirm your password
                </FieldLabel>

                <Input
                  {...field}
                  id={field.name}
                  type="password"
                  placeholder="********"
                  aria-invalid={fieldState.invalid}
                />

                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}

              </Field>
            )}
          />

        </CardContent>


        <CardFooter>
          <Button
            type="submit"
            className="w-full"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? 'Registering...' : 'Register'}
          </Button>
        </CardFooter>

      </Card>

    </form>
  );
};


export default Register;