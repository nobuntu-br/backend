import { Request, Response } from "express";
import { CreateUserInDirectoryUseCase } from "../useCases/userDirectory/createUserInDirectory.useCase";
import { GetUserPrincipalNameUseCase } from "../useCases/userDirectory/getUserPrincipalName.useCase";
import { ChangeUserPasswordUseCase } from "../useCases/userDirectory/changeUserPassword.useCase";
import { EditUserDetailsUseCase } from "../useCases/userDirectory/editUserDetails.caseUse";

export class UserDirectoryController {

  async createUserInDirectory(req: Request, res: Response) {
    try {
      const createUserUseCase: CreateUserInDirectoryUseCase = new CreateUserInDirectoryUseCase();

      // Obter os dados do usuário do corpo da requisição
      const userDetails = {
        displayName: req.body.displayName,
        surname: req.body.surname,
        givenName: req.body.givenName,
        mailNickname: req.body.mailNickname,
        userPrincipalName: req.body.userPrincipalName,
        password: req.body.password,
        email: req.body.email
      };

      // Chamar a função de execução
      const result = await createUserUseCase.execute(userDetails);

      if (result.success) {
        return res.status(201).json(result.data);
      } else {
        return res.status(400).json({ message: "Falha ao criar o usuário", error: result.error });
      }
    } catch (error: any) {
      return res.status(500).send({ message: "Ocorreu um erro desconhecido no servidor", error: error.message });
    }
  }

  async getUserPrincipalName(req: Request, res: Response) {
    try {
      const getUserPrincipalNameUseCase: GetUserPrincipalNameUseCase = new GetUserPrincipalNameUseCase();

      // Obter o email do corpo da requisição
      const { email } = req.body;

      // Chamar a função de execução
      const result = await getUserPrincipalNameUseCase.execute(email);

      if (result.success) {
        return res.status(200).json({
          message: 'UserPrincipalName retrieved successfully',
          userPrincipalName: result.data.userPrincipalName
        });
      } else {
        return res.status(404).json({
          message: result.error
        });
      }
    } catch (error: any) {
      return res.status(500).send({ message: "Falha ao recuperar o UserPrincipalName", error: error.message });
    }
  }

  async changeUserPassword(req: Request, res: Response) {
    try {
      const changeUserPasswordUseCase: ChangeUserPasswordUseCase = new ChangeUserPasswordUseCase();

      // Obter o email e a nova senha do corpo da requisição
      const { email, newPassword } = req.body;

      // Chamar a função de execução
      const result = await changeUserPasswordUseCase.execute(email, newPassword);

      if (result.success) {
        return res.status(200).json({
          message: 'Password changed successfully',
          user: result.data
        });
      } else {
        return res.status(404).json({ message: result.error });
      }
    } catch (error: any) {
      return res.status(500).send({ message: "Falha ao alterar a senha", error: error.message });
    }
  }

  async editUserDetails(req: Request, res: Response) {
    try {
      const editUserDetailsUseCase: EditUserDetailsUseCase = new EditUserDetailsUseCase();

      // Obter os dados do usuário do corpo da requisição
      const userDetails = {
        userId: req.body.userId,
        businessPhones: req.body.businessPhones,
        displayName: req.body.displayName,
        givenName: req.body.givenName,
        jobTitle: req.body.jobTitle,
        mobilePhone: req.body.mobilePhone,
        officeLocation: req.body.officeLocation,
        preferredLanguage: req.body.preferredLanguage,
        surname: req.body.surname
      };

      // Chamar a função de execução
      const result = await editUserDetailsUseCase.execute(userDetails);

      if (result.success) {
        return res.status(200).json({
          message: 'User details updated successfully',
        });
      } else {
        return res.status(500).json({
          message: 'Failed to update user details',
          data: result.data || result.error
        });
      }
    } catch (error: any) {
      return res.status(500).send({ message: "Falha ao atualizar os detalhes do usuário", error: error.message });
    }
  }
}
