"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { submitContactMessage } from "@/lib/actions";
import {
  contactMessageSchema,
  type ContactMessageInput,
} from "@/lib/validations";

export function ContactForm() {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactMessageInput>({
    resolver: zodResolver(contactMessageSchema),
    defaultValues: {
      full_name: "",
      email: "",
      phone: "",
      message: "",
      website: "",
    },
  });

  const onSubmit = async (data: ContactMessageInput) => {
    setLoading(true);
    const result = await submitContactMessage(data);
    setLoading(false);

    if (result.success) {
      toast.success("Message sent! We'll be in touch.");
      reset();
    } else {
      toast.error(result.error ?? "Something went wrong.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <input
        type="text"
        {...register("website")}
        className="hidden"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
      />

      <div>
        <Label htmlFor="contact_name">Name *</Label>
        <Input id="contact_name" {...register("full_name")} className="mt-1.5" />
        {errors.full_name && (
          <p className="mt-1 text-sm text-red-600">{errors.full_name.message}</p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="contact_email">Email</Label>
          <Input
            id="contact_email"
            type="email"
            {...register("email")}
            className="mt-1.5"
          />
        </div>
        <div>
          <Label htmlFor="contact_phone">Phone</Label>
          <Input id="contact_phone" {...register("phone")} className="mt-1.5" />
        </div>
      </div>

      <div>
        <Label htmlFor="contact_message">Message *</Label>
        <Textarea
          id="contact_message"
          {...register("message")}
          className="mt-1.5"
          rows={4}
        />
        {errors.message && (
          <p className="mt-1 text-sm text-red-600">{errors.message.message}</p>
        )}
      </div>

      <Button type="submit" disabled={loading} variant="secondary">
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Sending...
          </>
        ) : (
          "Send Message"
        )}
      </Button>
    </form>
  );
}
