// Copyright (C) 2022 Sebastien Guerri
//
// This file is part of markdown-header.
//
// markdown-header is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// any later version.
//
// markdown-header is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with markdown-header. If not, see <https://www.gnu.org/licenses/>.

/**
 * Generate random string
 * @param length Expected length of returned string
 * @returns String
 */
export function generateId(length: number = 12): string
{
	let result = '';
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    for (let i = 0; i < length; i++ ) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
   	}
   	return result;
}