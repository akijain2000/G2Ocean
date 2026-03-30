"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataSourceBadge } from "@/components/ui/data-source";
import { SEGMENTS, COMMODITIES, type VesselData } from "@/lib/types";
import dynamic from "next/dynamic";

const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const CircleMarker = dynamic(
  () => import("react-leaflet").then((mod) => mod.CircleMarker),
  { ssr: false }
);
const Popup = dynamic(
  () => import("react-leaflet").then((mod) => mod.Popup),
  { ssr: false }
);

interface Props {
  vessels: VesselData[];
}

export function VesselMap({ vessels }: Props) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const getColor = (segment: string) => {
    return SEGMENTS.find((s) => s.value === segment)?.color || "#666";
  };

  if (!mounted) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Fleet Positions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] md:h-[450px] bg-muted rounded-lg animate-pulse" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="space-y-1">
            <CardTitle className="text-base">Fleet Positions</CardTitle>
            <DataSourceBadge source="MarineTraffic AIS" isRealTime={false} description="Vessel positions plotted from Automatic Identification System (AIS) data. Color indicates vessel segment. Click a marker for details." />
          </div>
          <div className="flex items-center gap-2 sm:gap-3 text-xs flex-wrap">
            {SEGMENTS.map((seg) => (
              <div key={seg.value} className="flex items-center gap-1">
                <div
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: seg.color }}
                />
                <span className="text-muted-foreground">{seg.label}</span>
              </div>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] md:h-[450px] rounded-lg overflow-hidden border">
          <MapContainer
            center={[20, 0]}
            zoom={2}
            style={{ height: "100%", width: "100%" }}
            scrollWheelZoom={true}
          >
            <TileLayer
              attribution='&copy; <a href="https://carto.com/">CARTO</a>'
              url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            />
            {vessels
              .filter((v) => v.lat != null && v.lon != null)
              .map((vessel) => (
                <CircleMarker
                  key={vessel.imo}
                  center={[vessel.lat!, vessel.lon!]}
                  radius={6}
                  pathOptions={{
                    color: getColor(vessel.segment),
                    fillColor: getColor(vessel.segment),
                    fillOpacity: 0.8,
                    weight: 2,
                  }}
                >
                  <Popup>
                    <div className="text-xs space-y-1 min-w-[160px]">
                      <p className="font-bold text-sm">{vessel.name}</p>
                      <p>IMO: {vessel.imo}</p>
                      <p>DWT: {vessel.dwt.toLocaleString()}</p>
                      <p>Status: {vessel.status}</p>
                      {vessel.cargo && <p>Cargo: {COMMODITIES.find((c) => c.value === vessel.cargo)?.label || vessel.cargo}</p>}
                      {vessel.speed != null && <p>Speed: {vessel.speed} kn</p>}
                      {vessel.destination && <p>Dest: {vessel.destination}</p>}
                      {vessel.eta && <p>ETA: {vessel.eta}</p>}
                    </div>
                  </Popup>
                </CircleMarker>
              ))}
          </MapContainer>
        </div>
      </CardContent>
    </Card>
  );
}
