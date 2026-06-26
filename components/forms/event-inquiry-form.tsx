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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { submitEventInquiry } from "@/lib/actions";
import {
  eventInquirySchema,
  type EventInquiryInput,
} from "@/lib/validations";
import type { EventType } from "@/types/database.types";

interface EventInquiryFormProps {
  eventTypes: EventType[];
}

export function EventInquiryForm({ eventTypes }: EventInquiryFormProps) {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<EventInquiryInput>({
    resolver: zodResolver(eventInquirySchema),
    defaultValues: {
      full_name: "",
      phone: "",
      email: "",
      message: "",
      website: "",
    },
  });

  const onSubmit = async (data: EventInquiryInput) => {
    setLoading(true);
    const result = await submitEventInquiry(data);
    setLoading(false);

    if (result.success) {
      toast.success("Inquiry sent! We'll get back to you soon.");
      reset();
    } else {
      toast.error(result.error ?? "Something went wrong.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 rounded-2xl border border-palm/10 bg-sand/50 p-6 md:p-8"
    >
      <input
        type="text"
        {...register("website")}
        className="hidden"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
      />

      <div>
        <Label htmlFor="full_name">Full Name *</Label>
        <Input id="full_name" {...register("full_name")} className="mt-1.5" />
        {errors.full_name && (
          <p className="mt-1 text-sm text-red-600">{errors.full_name.message}</p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="phone">Phone *</Label>
          <Input id="phone" {...register("phone")} className="mt-1.5" />
          {errors.phone && (
            <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
          )}
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            {...register("email")}
            className="mt-1.5"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>
      </div>

      <div>
        <Label>Event Type</Label>
        <Select onValueChange={(v) => setValue("event_type_id", v)}>
          <SelectTrigger className="mt-1.5">
            <SelectValue placeholder="Select event type" />
          </SelectTrigger>
          <SelectContent>
            {eventTypes.map((et) => (
              <SelectItem key={et.id} value={et.id}>
                {et.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="preferred_date">Preferred Date</Label>
          <Input
            id="preferred_date"
            type="date"
            {...register("preferred_date")}
            className="mt-1.5"
          />
        </div>
        <div>
          <Label htmlFor="guest_count">Estimated Guests</Label>
          <Input
            id="guest_count"
            type="number"
            min={1}
            {...register("guest_count")}
            className="mt-1.5"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="message">Message</Label>
        <Textarea
          id="message"
          {...register("message")}
          className="mt-1.5"
          placeholder="Tell us about your event..."
        />
      </div>

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Sending...
          </>
        ) : (
          "Submit Inquiry"
        )}
      </Button>
    </form>
  );
}
