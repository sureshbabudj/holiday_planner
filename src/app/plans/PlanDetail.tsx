"use client";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { VacationPlan } from "@/types";
import { useEffect, useState } from "react";

interface PlanDetailProps {
  open: boolean;
  onClose?: () => void;
  plan: VacationPlan;
}
export default function PlanDetail({
  open = false,
  onClose,
  plan,
}: PlanDetailProps) {
  const [isOpen, setIsOpen] = useState(open);

  useEffect(() => {
    setIsOpen(open);
  }, [open]);

  return (
    <Sheet open={isOpen}>
      <SheetContent closeSheet={onClose}>
        <SheetHeader>
          <SheetTitle>{plan.itinerary.title}</SheetTitle>
          <SheetDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
}
