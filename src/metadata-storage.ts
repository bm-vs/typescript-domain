import type {BasicTypes} from './types';

export interface EntityMetadata {
	// eslint-disable-next-line @typescript-eslint/ban-types
	target: Function;
	field: string;
	// eslint-disable-next-line @typescript-eslint/ban-types
	type: BasicTypes | Object;
	array?: boolean;
	alias?: string;
}

class MetadataStorage {
	private static _instance: MetadataStorage;
	// eslint-disable-next-line @typescript-eslint/ban-types
	private readonly metadata = new Map<Function, EntityMetadata[]>();

	public static get Instance() {
		return this._instance || (this._instance = new this());
	}

	// eslint-disable-next-line @typescript-eslint/ban-types
	public getMetadata(target: Function): EntityMetadata[] | undefined {
		return this.metadata.get(target);
	}

	public addMetadata(metadata: EntityMetadata): void {
		const currentMetadata = this.metadata.get(metadata.target);
		this.metadata.set(
			metadata.target,
			currentMetadata ? [...currentMetadata, metadata] : [metadata]
		);
	}
}

export const defaultMetadataStorage = MetadataStorage.Instance;
