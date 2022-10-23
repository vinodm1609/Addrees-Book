import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel } from 'mongoose';

import { ContactDto } from './dto/addContacts.dto';
import { UpdateContactDTO } from './dto/updateContact.dto';
import { IContact } from './interface/contact.interface';
import { Contact, ContactDocument } from './schema/contact.schema';
import * as papa from 'papaparse';
import { IUser } from '../user/interface/register.interface';

@Injectable()
export class ContactService {
  constructor(
    @InjectModel(Contact.name)
    private readonly contact: PaginateModel<ContactDocument>,
  ) {}

  //Add a new contact.

  async addContact(
    addContactDto: ContactDto,
    user: { _id: any },
  ): Promise<IContact> {
    addContactDto = { ...addContactDto, ...{ user: user._id } };
    return this.contact.create(addContactDto);
  }

  async uploadContact(
    userID: any,
    file: Express.Multer.File,
  ): Promise<IContact[]> {
    const { fileRows } = await this.getCsvData(file.buffer.toString());
    fileRows.forEach((object) => {
      object.user = userID;
    });
    const contact = await this.contact.insertMany(fileRows);
    return contact;
  }

  async findById(id: string): Promise<IContact> {
    const contact = await this.contact.findOne({ _id: id });
    if (!contact) {
      throw new NotFoundException('id not match');
    }
    return contact;
  }

  async findCOntactPagination(page: number, limit: number, user: any) {
    const contact = await this.contact.paginate(
      { user: user._id },
      {
        page,
        limit,
      },
    );

    return { contact };
  }

  async searchContact(search: string, _user) {
    return this.contact.find({
      $or: [
        { contactPerson: { $regex: search, $options: 'i' } },
        { contactNumber: { $regex: search, $options: 'i' } },
      ],
    });
  }

  async updateContact(
    updateContactDto: UpdateContactDTO,
    id: string,
    user: IUser,
  ): Promise<ContactDocument> {
    if (!user) {
      throw new NotFoundException('user is not found');
    }
    return this.contact.findByIdAndUpdate(id, updateContactDto);
  }

  async deleteContact(id: string, user: any) {
    const contact = await this.contact.findById(id).lean();

    if (contact?.user?.toString() !== user._id.toString()) {
      throw new NotFoundException('contact not found');
    }
    const deleteContact = await this.contact.findByIdAndDelete(id);
    if (!deleteContact) {
      throw new NotFoundException('contact not found ');
    }
    return {
      message: 'contact Deleted Successfully !',
    };
  }

  async getCsvData(
    csvData: string,
  ): Promise<{ error: boolean; header: any[]; fileRows: any[] }> {
    return new Promise((resolve, reject) => {
      try {
        papa.parse(csvData, {
          header: true,
          skipEmptyLines: 'greedy',
          transformHeader: (header) => {
            return header.trim().replace(/['"]+/g, '');
          },
          complete: (results) => {
            resolve({
              error: false,
              header: results.meta.fields,
              fileRows: results.data,
            });
          },
        });
      } catch (error) {
        reject({ error: true, message: error });
      }
    });
  }
}
