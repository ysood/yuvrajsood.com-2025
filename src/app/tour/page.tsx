"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { countries } from "@/lib/countries";

const formSchema = z.object({
  firstName: z.string().min(1, {
    message: "First name is required.",
  }),
  lastName: z.string().min(1, {
    message: "Last name is required.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  city: z.string().min(1, {
    message: "City is required.",
  }),
  country: z.string().min(1, {
    message: "Country is required.",
  }),
  willingToTravel: z.enum(["yes", "no"], {
    message: "Please select if you're willing to travel.",
  }),
  discipline: z.enum(["photography", "videography", "both"], {
    message: "Please select your discipline.",
  }),
  experience: z.enum(["0-1", "2-4", "5+"], {
    message: "Please select your experience level.",
  }),
  instagram: z.string().min(1, {
    message: "Instagram handle is required.",
  }),
  equipment: z.string().min(1, {
    message: "Please list your camera and lens.",
  }),
  turnaround: z.enum(["24hours", "1-2days", "3+days"], {
    message: "Please select your typical turnaround time.",
  }),
  artists: z.string().min(1, {
    message: "Please list some artists.",
  }),
  consent: z.boolean().refine((val) => val === true, {
    message: "You must agree to continue.",
  }),
});

export default function TourPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "UTOPIA") {
      setIsAuthenticated(true);
      setPasswordError(false);
    } else {
      setPasswordError(true);
    }
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onBlur",
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      city: "",
      country: "",
      instagram: "",
      equipment: "",
      artists: "",
      consent: false,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      // Save to Supabase
      const { data, error } = await supabase
        .from("tour_applications")
        .insert([
          {
            first_name: values.firstName,
            last_name: values.lastName,
            email: values.email,
            city: values.city,
            country: values.country,
            willing_to_travel: values.willingToTravel,
            discipline: values.discipline,
            experience: values.experience,
            instagram: values.instagram,
            equipment: values.equipment,
            turnaround: values.turnaround,
            artists: values.artists,
            consent: values.consent,
          },
        ])
        .select();

      if (error) {
        console.error("Supabase error:", error);
        alert("Failed to submit application. Please try again.");
        return;
      }

      console.log("Application submitted:", data);

      // Reset form and show success message
      form.reset();
      setIsSubmitted(true);
    } catch (error) {
      console.error("Submission error:", error);
      alert("An error occurred. Please try again.");
    }
  }

  // Show password gate if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4 py-8 md:py-12 relative">
        <Card className="w-full max-w-sm bg-black border-zinc-800">
          <CardContent>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <Input
                  type="password"
                  placeholder="Enter password (it's in my broadcast channel)"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setPasswordError(false);
                  }}
                  className="bg-black border-zinc-800 text-white placeholder:text-zinc-600"
                  autoFocus
                />
                {passwordError && (
                  <p className="text-red-500 text-sm mt-2">
                    Incorrect password. Please try again.
                  </p>
                )}
              </div>
              <Button
                type="submit"
                className="w-full bg-white text-black hover:bg-zinc-200"
              >
                Enter
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Studio Threaded Logo - Fixed at bottom */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <img
            src="/studioThreadedSVG.svg"
            alt="Studio Threaded"
            className="w-12 h-auto opacity-100 hover:opacity-100 transition-opacity"
          />
        </div>
      </div>
    );
  }

  // Show success message after submission
  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4 py-8 md:py-12 relative">
        <div className="max-w-2xl text-center space-y-6">
          <p className="text-xl md:text-2xl text-zinc-400">
            Your application has been submitted successfully. We&apos;ll be in
            touch soon.
          </p>
        </div>

        {/* Studio Threaded Logo - Fixed at bottom */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <img
            src="/studioThreadedSVG.svg"
            alt="Studio Threaded"
            className="w-12 h-auto opacity-100 hover:opacity-100 transition-opacity"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black px-4 py-8 md:py-12">
      <div className="max-w-3xl mx-auto">
        <Card className="w-full bg-black border-zinc-800">
          <CardHeader className="space-y-2">
            <CardTitle className="text-l md:text-xl text-white">
              Studio Threaded Network
            </CardTitle>
            <CardDescription className="text-zinc-400 text-sm">
              Please fill out all required fields marked with * to apply.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6 md:space-y-8"
              >
                {/* Section 1: Basic Information */}
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">
                          First name *
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Jane"
                            {...field}
                            className="bg-black border-zinc-800 text-white placeholder:text-zinc-600"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">
                          Last name *
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Smith"
                            {...field}
                            className="bg-black border-zinc-800 text-white placeholder:text-zinc-600"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Email *</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="name@example.com"
                            {...field}
                            className="bg-black border-zinc-800 text-white placeholder:text-zinc-600"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Section 2: Where are you based */}
                <div className="space-y-4 pt-6 border-t border-zinc-800">
                  <div>
                    <h3 className="text-lg md:text-xl font-semibold text-white mb-1">
                      2 → Where are you based*
                    </h3>
                  </div>

                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">City*</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Type your answer here..."
                            {...field}
                            className="bg-black border-zinc-800 text-white placeholder:text-zinc-600"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="country"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Country*</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="bg-black border-zinc-800 text-white">
                              <SelectValue placeholder="Type or select an option" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-black border-zinc-800 text-white">
                            {countries.map((country) => (
                              <SelectItem key={country} value={country}>
                                {country}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="willingToTravel"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel className="text-white">
                          Are you willing to travel?*
                        </FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4"
                          >
                            <div>
                              <RadioGroupItem
                                value="yes"
                                id="yes"
                                className="peer sr-only"
                              />
                              <Label
                                htmlFor="yes"
                                className="flex items-center justify-start gap-3 rounded-md border-2 border-zinc-800 bg-black p-3 md:p-4 hover:bg-zinc-900 peer-data-[state=checked]:border-white cursor-pointer"
                              >
                                <span className="text-white font-mono">A</span>
                                <span className="text-white">Yes</span>
                              </Label>
                            </div>
                            <div>
                              <RadioGroupItem
                                value="no"
                                id="no"
                                className="peer sr-only"
                              />
                              <Label
                                htmlFor="no"
                                className="flex items-center justify-start gap-3 rounded-md border-2 border-zinc-800 bg-black p-3 md:p-4 hover:bg-zinc-900 peer-data-[state=checked]:border-white cursor-pointer"
                              >
                                <span className="text-white font-mono">B</span>
                                <span className="text-white">No</span>
                              </Label>
                            </div>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Section 3: Your experience */}
                <div className="space-y-4 pt-6 border-t border-zinc-800">
                  <div>
                    <h3 className="text-lg md:text-xl font-semibold text-white mb-1">
                      3 → Your experience*
                    </h3>
                    <p className="text-sm text-zinc-500 italic">
                      Your experience will not negatively affect your chances to
                      get opportunities, it&apos;s primarily for us to build
                      teams with varying experience.
                    </p>
                  </div>

                  <FormField
                    control={form.control}
                    name="discipline"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel className="text-white">
                          Which discipline do you specialise in?*
                        </FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4"
                          >
                            <div>
                              <RadioGroupItem
                                value="photography"
                                id="photography"
                                className="peer sr-only"
                              />
                              <Label
                                htmlFor="photography"
                                className="flex items-center justify-start gap-3 rounded-md border-2 border-zinc-800 bg-black p-3 md:p-4 hover:bg-zinc-900 peer-data-[state=checked]:border-white cursor-pointer"
                              >
                                <span className="text-white font-mono">A</span>
                                <span className="text-white">Photography</span>
                              </Label>
                            </div>
                            <div>
                              <RadioGroupItem
                                value="videography"
                                id="videography"
                                className="peer sr-only"
                              />
                              <Label
                                htmlFor="videography"
                                className="flex items-center justify-start gap-3 rounded-md border-2 border-zinc-800 bg-black p-3 md:p-4 hover:bg-zinc-900 peer-data-[state=checked]:border-white cursor-pointer"
                              >
                                <span className="text-white font-mono">B</span>
                                <span className="text-white">Videography</span>
                              </Label>
                            </div>
                            <div>
                              <RadioGroupItem
                                value="both"
                                id="both"
                                className="peer sr-only"
                              />
                              <Label
                                htmlFor="both"
                                className="flex items-center justify-start gap-3 rounded-md border-2 border-zinc-800 bg-black p-3 md:p-4 hover:bg-zinc-900 peer-data-[state=checked]:border-white cursor-pointer"
                              >
                                <span className="text-white font-mono">C</span>
                                <span className="text-white">Both</span>
                              </Label>
                            </div>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="experience"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel className="text-white">
                          How many years of concert photography experience do
                          you have?*
                        </FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4"
                          >
                            <div>
                              <RadioGroupItem
                                value="0-1"
                                id="exp-0-1"
                                className="peer sr-only"
                              />
                              <Label
                                htmlFor="exp-0-1"
                                className="flex items-center justify-start gap-3 rounded-md border-2 border-zinc-800 bg-black p-3 md:p-4 hover:bg-zinc-900 peer-data-[state=checked]:border-white cursor-pointer"
                              >
                                <span className="text-white font-mono">A</span>
                                <span className="text-white">0-1</span>
                              </Label>
                            </div>
                            <div>
                              <RadioGroupItem
                                value="2-4"
                                id="exp-2-4"
                                className="peer sr-only"
                              />
                              <Label
                                htmlFor="exp-2-4"
                                className="flex items-center justify-start gap-3 rounded-md border-2 border-zinc-800 bg-black p-3 md:p-4 hover:bg-zinc-900 peer-data-[state=checked]:border-white cursor-pointer"
                              >
                                <span className="text-white font-mono">B</span>
                                <span className="text-white">2-4</span>
                              </Label>
                            </div>
                            <div>
                              <RadioGroupItem
                                value="5+"
                                id="exp-5+"
                                className="peer sr-only"
                              />
                              <Label
                                htmlFor="exp-5+"
                                className="flex items-center justify-start gap-3 rounded-md border-2 border-zinc-800 bg-black p-3 md:p-4 hover:bg-zinc-900 peer-data-[state=checked]:border-white cursor-pointer"
                              >
                                <span className="text-white font-mono">C</span>
                                <span className="text-white">5+</span>
                              </Label>
                            </div>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="instagram"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">
                          Your Instagram Handle (Ex: @yvsdna)*
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Type your answer here..."
                            {...field}
                            className="bg-black border-zinc-800 text-white placeholder:text-zinc-600"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Section 4: More about your experience */}
                <div className="space-y-4 pt-6 border-t border-zinc-800">
                  <div>
                    <h3 className="text-lg md:text-xl font-semibold text-white mb-1">
                      4 → More about your experience*
                    </h3>
                  </div>

                  <FormField
                    control={form.control}
                    name="equipment"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">
                          Which Camera and Lens do you use? (Ex: Sony FX3 + Sony
                          24-70 f2.8)*
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Type your answer here..."
                            {...field}
                            className="bg-black border-zinc-800 text-white placeholder:text-zinc-600"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="turnaround"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel className="text-white">
                          Typical concert content turnaround time*
                        </FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4"
                          >
                            <div>
                              <RadioGroupItem
                                value="24hours"
                                id="24hours"
                                className="peer sr-only"
                              />
                              <Label
                                htmlFor="24hours"
                                className="flex items-center justify-start gap-3 rounded-md border-2 border-zinc-800 bg-black p-3 md:p-4 hover:bg-zinc-900 peer-data-[state=checked]:border-white cursor-pointer"
                              >
                                <span className="text-white font-mono">A</span>
                                <span className="text-white">
                                  {"< 24 hours"}
                                </span>
                              </Label>
                            </div>
                            <div>
                              <RadioGroupItem
                                value="1-2days"
                                id="1-2days"
                                className="peer sr-only"
                              />
                              <Label
                                htmlFor="1-2days"
                                className="flex items-center justify-start gap-3 rounded-md border-2 border-zinc-800 bg-black p-3 md:p-4 hover:bg-zinc-900 peer-data-[state=checked]:border-white cursor-pointer"
                              >
                                <span className="text-white font-mono">B</span>
                                <span className="text-white">1-2 days</span>
                              </Label>
                            </div>
                            <div>
                              <RadioGroupItem
                                value="3+days"
                                id="3+days"
                                className="peer sr-only"
                              />
                              <Label
                                htmlFor="3+days"
                                className="flex items-center justify-start gap-3 rounded-md border-2 border-zinc-800 bg-black p-3 md:p-4 hover:bg-zinc-900 peer-data-[state=checked]:border-white cursor-pointer"
                              >
                                <span className="text-white font-mono">C</span>
                                <span className="text-white">3+ days</span>
                              </Label>
                            </div>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="artists"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">
                          List some of your favourite artists that you want to
                          work with*
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Type your answer here..."
                            {...field}
                            className="bg-black border-zinc-800 text-white placeholder:text-zinc-600 min-h-[100px]"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Section 5: Consent */}
                <div className="space-y-4 pt-6 border-t border-zinc-800">
                  <div>
                    <h3 className="text-base md:text-lg font-semibold text-white mb-1 leading-relaxed">
                      5 → By submitting this form, I represent that the
                      information provided is accurate, and I authorize the
                      recipient to contact me regarding photography
                      opportunities, events, or related professional matters.*
                    </h3>
                  </div>

                  <FormField
                    control={form.control}
                    name="consent"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className="border-zinc-800 data-[state=checked]:bg-white data-[state=checked]:text-black"
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="text-white font-normal">
                            I agree
                          </FormLabel>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />
                </div>

                <Button
                  type="submit"
                  disabled={form.formState.isSubmitting}
                  className="w-full bg-white text-black hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {form.formState.isSubmitting ? "Submitting..." : "Submit"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Studio Threaded Logo - Below form */}
        <div className="mt-12 pb-8 flex justify-center">
          <img
            src="/studioThreadedSVG.svg"
            alt="Studio Threaded"
            className="w-12 h-auto opacity-100 hover:opacity-100 transition-opacity"
          />
        </div>
      </div>
    </div>
  );
}
