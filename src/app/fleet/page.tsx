"use client";

import { useEffect, useState, useCallback } from "react";
import { VesselMap } from "@/components/fleet/VesselMap";
import { FleetTable } from "@/components/fleet/FleetTable";
import { NewbuildingTracker } from "@/components/fleet/NewbuildingTracker";
import { SEGMENTS, type VesselData, type NewbuildingData, type ShippingSegment } from "@/lib/types";
import { getVessels, getNewbuildings } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";

export default function FleetMonitorPage() {
  const [vessels, setVessels] = useState<VesselData[]>([]);
  const [newbuildings, setNewbuildings] = useState<NewbuildingData[]>([]);
  const [selectedSegment, setSelectedSegment] = useState<ShippingSegment | "all">("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setVessels(getVessels());
      setNewbuildings(getNewbuildings());
    } catch (err) {
      console.error("Failed to fetch fleet data:", err);
      setError("Failed to load fleet data. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filteredVessels =
    selectedSegment === "all"
      ? vessels
      : vessels.filter((v) => v.segment === selectedSegment);
  const filteredBuilds =
    selectedSegment === "all"
      ? newbuildings
      : newbuildings.filter((b) => b.segment === selectedSegment);

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold">Fleet Monitor</h2>
          <p className="text-sm text-muted-foreground mt-1">Loading fleet data...</p>
        </div>
        <Skeleton className="h-[520px]" />
        <Skeleton className="h-[400px]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Fleet Monitor</h2>
        <div className="rounded-lg border border-destructive/50 bg-destructive/5 p-6 text-center">
          <p className="text-sm text-destructive">{error}</p>
          <button onClick={() => { setError(null); setLoading(true); fetchData(); }} className="mt-3 text-sm text-primary underline">Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Fleet Monitor</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Track vessel positions, fleet composition, and newbuilding developments
        </p>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-sm font-medium text-muted-foreground mr-1">Filter:</span>
        <button onClick={() => setSelectedSegment("all")}>
          <Badge variant={selectedSegment === "all" ? "default" : "outline"} className="cursor-pointer">
            All Segments
          </Badge>
        </button>
        {SEGMENTS.map((seg) => (
          <button key={seg.value} onClick={() => setSelectedSegment(seg.value)}>
            <Badge
              variant={selectedSegment === seg.value ? "default" : "outline"}
              className="cursor-pointer"
              style={
                selectedSegment === seg.value
                  ? { backgroundColor: seg.color, borderColor: seg.color }
                  : undefined
              }
            >
              {seg.label}
            </Badge>
          </button>
        ))}
      </div>

      <Tabs defaultValue="map">
        <TabsList>
          <TabsTrigger value="map">Map View</TabsTrigger>
          <TabsTrigger value="table">Fleet Table</TabsTrigger>
          <TabsTrigger value="newbuildings">Newbuildings</TabsTrigger>
        </TabsList>

        <TabsContent value="map">
          <VesselMap vessels={filteredVessels} />
        </TabsContent>

        <TabsContent value="table">
          <FleetTable vessels={filteredVessels} />
        </TabsContent>

        <TabsContent value="newbuildings">
          <NewbuildingTracker newbuildings={filteredBuilds} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
