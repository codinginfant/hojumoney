package com.codestates.server.member.dto;

import javax.validation.constraints.NotBlank;
import lombok.Getter;

@Getter
public class LoginDto {
    @NotBlank(message = "이메일을 입력해주세요")
    private String email;
    @NotBlank(message = "비밀번호를 입력해주세요")
    private String password;

}
