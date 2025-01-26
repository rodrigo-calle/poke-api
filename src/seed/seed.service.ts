import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { PokeResponse } from './interface/poke-response.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { Model } from 'mongoose';
import { AxiosAdapter } from 'src/common/adapters/axios.adapter';

@Injectable()
export class SeedService {
  constructor(
    @InjectModel(Pokemon.name)
    private pokemonModel: Model<Pokemon>,

    private readonly http: AxiosAdapter,
  ) {}
  private readonly axios: AxiosInstance = axios;
  async create() {
    await this.pokemonModel.deleteMany({});
    const data = await this.http.get<PokeResponse>(
      'https://pokeapi.co/api/v2/pokemon?limit=650',
    );

    const pokemonToInsert: { name: string; no: number }[] = data.results.map(
      (pokemon) => {
        return {
          name: pokemon.name,
          no: +pokemon.url.split('/')[6],
        };
      },
    );

    await this.pokemonModel.insertMany(pokemonToInsert);
    return 'Seed executed';
  }
}
