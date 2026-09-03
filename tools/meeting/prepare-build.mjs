import fs from 'node:fs/promises'
import path from 'node:path'

const root = process.cwd()
const cargoPath = path.join(root, 'src-tauri', 'Cargo.toml')
const lockPath = path.join(root, 'Cargo.lock')

function updatePackageSection(source) {
  const match = source.match(/\[package\]\n([\s\S]*?)(?=\n\[)/)
  if (!match) throw new Error('Could not find the root Cargo package section')

  const name = match[1].match(/^name = "([^"]+)"$/m)?.[1]
  if (!name) throw new Error('Could not find the Cargo package name')

  const updated = match[1]
    .replace(/^name = "[^"]+"$/m, 'name = "meeting"')
    .replace(/^description = "[^"]+"$/m, 'description = "Meeting"')
    .replace(/^default-run = "[^"]+"$/m, 'default-run = "meeting"')

  if (!updated.includes('name = "meeting"')) {
    throw new Error('Could not update the Cargo package name')
  }

  return { source: source.replace(match[1], updated), name }
}

function updateLockPackage(source, packageName) {
  const marker = `[[package]]\nname = "${packageName}"\n`
  if (source.includes(marker)) {
    return source.replace(marker, '[[package]]\nname = "meeting"\n')
  }
  if (source.includes('[[package]]\nname = "meeting"\n')) return source
  throw new Error('Could not find the root package in Cargo.lock')
}

const cargo = await fs.readFile(cargoPath, 'utf8')
const lock = await fs.readFile(lockPath, 'utf8')
const updatedCargo = updatePackageSection(cargo)
await fs.writeFile(cargoPath, updatedCargo.source)
await fs.writeFile(lockPath, updateLockPackage(lock, updatedCargo.name))

console.log('Prepared Cargo metadata for Meeting (meeting / meeting.exe).')
