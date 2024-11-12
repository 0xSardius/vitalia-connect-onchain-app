import { Avatar, Name } from "@coinbase/onchainkit/identity";
import { useProfile } from "@/hooks/useProfile";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CalendarIcon,
  EnvelopeClosedIcon,
  MobileIcon,
} from "@radix-ui/react-icons";

interface ProfileCardProps {
  address?: `0x${string}`;
  onEdit?: () => void;
}

export default function ProfileCard({ address, onEdit }: ProfileCardProps) {
  const { profile, stats, isLoading } = useProfile(address);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse flex space-x-4">
            <div className="rounded-full bg-slate-200 h-12 w-12"></div>
            <div className="flex-1 space-y-4 py-1">
              <div className="h-4 bg-slate-200 rounded w-3/4"></div>
              <div className="space-y-3">
                <div className="h-4 bg-slate-200 rounded"></div>
                <div className="h-4 bg-slate-200 rounded w-5/6"></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!profile) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-muted-foreground">No profile found</p>
          {onEdit && (
            <Button onClick={onEdit} className="mt-4">
              Create Profile
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-4">
          <Avatar address={address} className="h-12 w-12" />
          <div>
            <Name address={address} className="text-xl font-bold" />
            {profile.credentials && (
              <p className="text-sm text-muted-foreground">
                {profile.credentials}
              </p>
            )}
          </div>
        </div>
        {onEdit && (
          <Button variant="outline" size="sm" onClick={onEdit}>
            Edit Profile
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Bio */}
          {profile.bio && (
            <div>
              <p className="text-sm leading-6">{profile.bio}</p>
            </div>
          )}

          {/* Expertise Areas */}
          <div>
            <h3 className="font-medium mb-2 text-sm">Areas of Expertise</h3>
            <div className="flex flex-wrap gap-2">
              {profile.expertiseAreas.map((area) => (
                <Badge key={area} variant="secondary">
                  {area}
                </Badge>
              ))}
            </div>
          </div>

          {/* Status & Travel */}
          <div>
            <h3 className="font-medium mb-2 text-sm">Status</h3>
            <div className="flex items-center gap-2 mb-2">
              <span
                className={`h-2 w-2 rounded-full ${
                  profile.onSiteStatus ? "bg-green-500" : "bg-yellow-500"
                }`}
              />
              <span className="text-sm">
                {profile.onSiteStatus ? "Currently On Site" : "Off Site"}
              </span>
            </div>
            {profile.travelDetails && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CalendarIcon className="h-4 w-4" />
                <span>{profile.travelDetails}</span>
              </div>
            )}
          </div>

          {/* Stats */}
          {stats && (
            <div>
              <h3 className="font-medium mb-2 text-sm">Activity</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-3 bg-muted rounded-lg">
                  <p className="text-2xl font-bold">{stats.completed}</p>
                  <p className="text-xs text-muted-foreground">Completed</p>
                </div>
                <div className="text-center p-3 bg-muted rounded-lg">
                  <p className="text-2xl font-bold">{stats.created}</p>
                  <p className="text-xs text-muted-foreground">Created</p>
                </div>
                <div className="text-center p-3 bg-muted rounded-lg">
                  <p className="text-2xl font-bold">{stats.responses}</p>
                  <p className="text-xs text-muted-foreground">Responses</p>
                </div>
              </div>
            </div>
          )}

          {/* Contact */}
          <div>
            <h3 className="font-medium mb-2 text-sm">Contact Information</h3>
            <div className="space-y-2">
              {profile.contactInfo.includes("@") ? (
                <div className="flex items-center gap-2 text-sm">
                  <EnvelopeClosedIcon className="h-4 w-4 text-muted-foreground" />
                  <span>{profile.contactInfo}</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-sm">
                  <MobileIcon className="h-4 w-4 text-muted-foreground" />
                  <span>{profile.contactInfo}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
