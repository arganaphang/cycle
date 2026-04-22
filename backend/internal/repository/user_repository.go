package repository

import (
	"context"

	"github.com/arganaphang/cycle/backend/graph/model"
	"github.com/arganaphang/cycle/backend/internal/entity"
	"github.com/doug-martin/goqu/v9"
	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
	"golang.org/x/crypto/bcrypt"
)

type UserRepository interface {
	FindByID(ctx context.Context, id uuid.UUID) (*entity.User, error)
	FindByEmail(ctx context.Context, email string) (*entity.User, error)
	Create(ctx context.Context, input model.CreateUserInput) (*entity.User, error)
	Update(ctx context.Context, id uuid.UUID, input model.UpdateUserInput) (*entity.User, error)
}

type userRepository struct {
	db *sqlx.DB
}

func NewUserRepository(db *sqlx.DB) UserRepository {
	return &userRepository{db: db}
}

// Create implements [UserRepository].
func (u *userRepository) Create(ctx context.Context, input model.CreateUserInput) (*entity.User, error) {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(input.Password), bcrypt.DefaultCost)
	if err != nil {
		return nil, err
	}
	stmt := goqu.Insert(entity.TABLE_USER).
		Rows(goqu.Record{
			"email":         input.Email,
			"password_hash": hashedPassword,
			"role":          input.Role,
		}).
		Returning("*")
	sql, _, _ := stmt.ToSQL()
	user := entity.User{}
	if err := u.db.Get(&user, sql); err != nil {
		return nil, err
	}
	return &user, nil
}

// FindByID implements [UserRepository].
func (u *userRepository) FindByID(ctx context.Context, id uuid.UUID) (*entity.User, error) {
	sql, _, _ := goqu.From(entity.TABLE_USER).Where(goqu.C("id").Eq(id)).ToSQL()
	user := entity.User{}
	if err := u.db.Get(&user, sql); err != nil {
		return nil, err
	}
	return &user, nil
}

// FindByEmail implements [UserRepository].
func (u *userRepository) FindByEmail(ctx context.Context, email string) (*entity.User, error) {
	sql, _, _ := goqu.From(entity.TABLE_USER).Where(goqu.C("email").Eq(email)).ToSQL()
	user := entity.User{}
	if err := u.db.Get(&user, sql); err != nil {
		return nil, err
	}
	return &user, nil
}

// Update implements [UserRepository].
func (u *userRepository) Update(ctx context.Context, id uuid.UUID, input model.UpdateUserInput) (*entity.User, error) {
	records := goqu.Record{}
	if input.Email != nil {
		records["email"] = *input.Email
	}
	if input.Password != nil {
		hashedPassword, err := bcrypt.GenerateFromPassword([]byte(*input.Password), bcrypt.DefaultCost)
		if err != nil {
			return nil, err
		}
		records["password_hash"] = hashedPassword
	}
	if input.Role != nil {
		records["role"] = *input.Role
	}
	sql, _, err := goqu.Update(entity.TABLE_USER).
		Set(records).
		Where(goqu.C("id").Eq(id)).
		Returning("*").
		ToSQL()
	if err != nil {
		return nil, err
	}
	user := entity.User{}
	if err := u.db.Get(&user, sql); err != nil {
		return nil, err
	}
	return &user, nil
}
