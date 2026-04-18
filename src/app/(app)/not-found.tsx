import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AppNotFound() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-6 py-12">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>404 - Page Not Found</CardTitle>
          <CardDescription>お探しのページは存在しないか、移動された可能性があります。</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-end">
          <Button asChild>
            <Link href="/dashboard">Dashboard</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
