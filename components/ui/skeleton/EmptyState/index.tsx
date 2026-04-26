import { Calendar } from "lucide-react";
import { Card, CardContent } from "../../card";

function EmptyState({
  title,
  description,
  action,
  variant,
}: {
  title: string;
  description: string;
  action?: React.ReactNode;
  variant: "booking" | "";
}) {
  return (
    <>
      {variant === "booking" && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <Calendar className="mb-4 h-14 w-14 text-slate-300" />
            <h3 className="text-xl font-semibold">{title}</h3>
            <p className="mt-2 max-w-md text-slate-600">{description}</p>
            {action}
          </CardContent>
        </Card>
      )}
    </>
  );
}

export default EmptyState;
