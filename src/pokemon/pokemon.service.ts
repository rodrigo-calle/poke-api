import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { isValidObjectId, Model } from 'mongoose';
import { Pokemon } from './entities/pokemon.entity';
import { InjectModel } from '@nestjs/mongoose';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PokemonService {
  private defaultLimit: number;
  constructor(
    @InjectModel(Pokemon.name)
    private pokemonModel: Model<Pokemon>,
    private readonly configService: ConfigService,
  ) {
    this.defaultLimit = this.configService.get<number>('defaultlimit')!;
  }
  async create(createPokemonDto: CreatePokemonDto) {
    try {
      const pokemon = await this.pokemonModel.create(createPokemonDto);
      return pokemon;
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (error.code === 11000) {
        throw new BadRequestException(
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          `Pokemon exist in db ${JSON.stringify(error.keyValue)}`,
        );
      }
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      console.log({ error });
      throw new InternalServerErrorException(
        `Can't create Pokemon - Check server logs`,
      );
    }
  }

  findAll(paginationDto: PaginationDto) {
    const { limit = this.defaultLimit, offset = 0 } = paginationDto;
    const pokemons = this.pokemonModel
      .find()
      .limit(limit)
      .skip(offset)
      .sort({ no: 1 })
      .select('-__v');

    return pokemons;
  }

  async findOne(term: string) {
    let pokemon: Pokemon | null = null;

    if (isValidObjectId(term)) {
      pokemon = await this.pokemonModel.findById(term);
    }

    if (!isNaN(+term)) {
      pokemon = await this.pokemonModel.findOne({ no: term });
    }

    if (!pokemon) {
      pokemon = await this.pokemonModel.findOne({ name: term.toLowerCase() });
    }

    if (pokemon === null) {
      throw new NotFoundException(`Pokemon ${term} not found`);
    }

    return pokemon;
  }

  async update(id: string, updatePokemonDto: UpdatePokemonDto) {
    const pokemonUpdated = await this.pokemonModel.findOneAndUpdate(
      { _id: id },
      updatePokemonDto,
      {
        new: true,
      },
    );
    return pokemonUpdated;
  }

  async remove(id: string) {
    const { deletedCount } = await this.pokemonModel.deleteOne({
      _id: id,
    });
    if (deletedCount === 0) {
      throw new NotFoundException(`Pokemon ${id} not found`);
    }
    return `Pokemon ${id} deleted`;
  }
}
