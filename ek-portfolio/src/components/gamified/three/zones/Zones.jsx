import { ZoneDirector } from './common'
import { SpawnPlazaZone } from './SpawnPlaza'
import { ForgeZone, ObeliskZone, RuinsZone } from './QuestCheckpoints'
import { CampfireZone } from './Campfire'
import { ArmoryZone } from './Armory'
import { PortalGateZone } from './PortalGate'

export function Zones() {
  return (
    <>
      <ZoneDirector />
      <SpawnPlazaZone />
      <ForgeZone />
      <ObeliskZone />
      <RuinsZone />
      <CampfireZone />
      <ArmoryZone />
      <PortalGateZone />
    </>
  )
}
